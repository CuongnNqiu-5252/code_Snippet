"""
Logging Middleware — ghi lại mọi API action vào collection `action_logs`.

Mỗi request tạo ra 1 document:
{
  "method":      "POST",
  "path":        "/snippets",
  "action":      "create_snippet",
  "user_id":     "64f3a...",   # null nếu chưa login
  "status_code": 201,
  "duration_ms": 42,
  "ip":          "127.0.0.1",
  "body_preview": {"title": "Binary Search", "language": "python"},  # chỉ key, không value nhạy cảm
  "error":       null,         # message nếu có exception
  "timestamp":   ISODate(...)
}
"""
import asyncio
import time
import re
from datetime import datetime, timezone
from typing import Optional

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.core.database import get_db
from app.core.queue import event_queue

# ── Map (METHOD, path_pattern) → action name ──────────────────────────────────
ACTION_MAP = [
    ("POST",   r"^/auth/register$",             "auth_register"),
    ("POST",   r"^/auth/login$",                "auth_login"),
    ("POST",   r"^/snippets$",                  "create_snippet"),
    ("GET",    r"^/snippets$",                  "list_snippets"),
    ("GET",    r"^/snippets/[^/]+$",            "view_snippet"),
    ("PUT",    r"^/snippets/[^/]+$",            "update_snippet"),
    ("DELETE", r"^/snippets/[^/]+$",            "delete_snippet"),
    ("GET",    r"^/search$",                    "keyword_search"),
    ("GET",    r"^/search/semantic$",           "semantic_search"),
    ("POST",   r"^/bookmarks/[^/]+$",           "toggle_bookmark"),
    ("GET",    r"^/bookmarks$",                 "list_bookmarks"),
    ("GET",    r"^/recommendations$",           "get_recommendations"),
    ("GET",    r"^/snippets/[^/]+/related$",    "get_related"),
]

# Paths để bỏ qua (không cần log)
SKIP_PATHS = {"/health", "/docs", "/openapi.json", "/redoc", "/favicon.ico"}


def _resolve_action(method: str, path: str) -> str:
    for m, pattern, action in ACTION_MAP:
        if m == method and re.match(pattern, path):
            return action
    return f"{method.lower()}:{path}"


def _extract_user_id(request: Request) -> Optional[str]:
    """Lấy user_id từ JWT mà không cần verify lại (chỉ để log)."""
    try:
        auth = request.headers.get("authorization", "")
        if not auth.startswith("Bearer "):
            return None
        token = auth.split(" ", 1)[1]
        # Decode payload mà không verify signature (chỉ để lấy sub)
        import base64, json
        payload_b64 = token.split(".")[1]
        # Thêm padding nếu thiếu
        payload_b64 += "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        return payload.get("sub")
    except Exception:
        return None


class ActionLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Bỏ qua các path không cần log
        if path in SKIP_PATHS or path.startswith("/static"):
            return await call_next(request)

        start = time.monotonic()
        error_msg = None
        status_code = 500

        try:
            response: Response = await call_next(request)
            status_code = response.status_code
        except Exception as exc:
            error_msg = str(exc)
            raise
        finally:
            duration_ms = round((time.monotonic() - start) * 1000)
            await self._write_log(
                method=request.method,
                path=path,
                query=str(request.query_params) or None,
                user_id=_extract_user_id(request),
                status_code=status_code,
                duration_ms=duration_ms,
                ip=request.client.host if request.client else None,
                error=error_msg,
            )

        return response

    async def _write_log(self, **kwargs):
        try:
            db = get_db()
            action = _resolve_action(kwargs["method"], kwargs["path"])

            asyncio.create_task(
                event_queue.put({
                "action":      action,
                "method":      kwargs["method"],
                "path":        kwargs["path"],
                "query":       kwargs.get("query"),
                "user_id":     kwargs.get("user_id"),
                "status_code": kwargs["status_code"],
                "duration_ms": kwargs["duration_ms"],
                "ip":          kwargs.get("ip"),
                "error":       kwargs.get("error"),
                "timestamp":   datetime.now(timezone.utc),
            })
            )
            # await db.action_logs.insert_one({
            #     "action":      action,
            #     "method":      kwargs["method"],
            #     "path":        kwargs["path"],
            #     "query":       kwargs.get("query"),
            #     "user_id":     kwargs.get("user_id"),
            #     "status_code": kwargs["status_code"],
            #     "duration_ms": kwargs["duration_ms"],
            #     "ip":          kwargs.get("ip"),
            #     "error":       kwargs.get("error"),
            #     "timestamp":   datetime.now(timezone.utc),
            # })
        except Exception:
            pass  # Không để lỗi log crash app chính