from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import HTTPException, status

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.snippet import SnippetCreate, SnippetOut, SnippetUpdate


def _serialize(doc: dict) -> SnippetOut:
    return SnippetOut(
        id=str(doc["_id"]),
        title=doc["title"],
        code=doc["code"],
        language=doc["language"],
        tags=doc.get("tags", []),
        is_public=doc.get("isPublic", True),
        created_by=str(doc["createdBy"]),
        created_at=doc["createdAt"],
        updated_at=doc["updatedAt"],
        summary=doc.get("summary"),
        status=doc.get("status", "pending"),
    )


async def create_snippet(data: SnippetCreate, user_id: str) -> SnippetOut:
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = {
        "title": data.title,
        "code": data.code,
        "language": data.language,
        "tags": data.tags,
        "isPublic": data.is_public,
        "createdBy": ObjectId(user_id),
        "createdAt": now,
        "updatedAt": now,
        "summary": None,
        "embedding": [],
        "status": "pending",  # AI will fill summary in Phase 2
    }
    result = await db.snippets.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize(doc)


async def list_snippets(
    user_id: str,
    language: Optional[str] = None,
    tag: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[SnippetOut]:
    db = get_db()
    query: dict = {
        "$or": [
            {"createdBy": ObjectId(user_id)},
            {"isPublic": True},
        ]
    }
    if language:
        query["language"] = language
    if tag:
        query["tags"] = tag

    cursor = db.snippets.find(query).sort("createdAt", -1).skip(skip).limit(limit)
    return [_serialize(doc) async for doc in cursor]


async def get_snippet(snippet_id: str, user_id: str) -> SnippetOut:
    db = get_db()
    doc = await db.snippets.find_one({"_id": ObjectId(snippet_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Snippet not found")
    if not doc["isPublic"] and str(doc["createdBy"]) != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return _serialize(doc)


async def update_snippet(snippet_id: str, data: SnippetUpdate, user_id: str) -> SnippetOut:
    db = get_db()
    doc = await db.snippets.find_one({"_id": ObjectId(snippet_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Snippet not found")
    if str(doc["createdBy"]) != user_id:
        raise HTTPException(status_code=403, detail="Not your snippet")

    updates = {k: v for k, v in {
        "title": data.title,
        "code": data.code,
        "language": data.language,
        "tags": data.tags,
        "isPublic": data.is_public,
    }.items() if v is not None}
    updates["updatedAt"] = datetime.now(timezone.utc)

    await db.snippets.update_one({"_id": ObjectId(snippet_id)}, {"$set": updates})
    return await get_snippet(snippet_id, user_id)


async def delete_snippet(snippet_id: str, user_id: str) -> None:
    db = get_db()
    doc = await db.snippets.find_one({"_id": ObjectId(snippet_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Snippet not found")
    if str(doc["createdBy"]) != user_id:
        raise HTTPException(status_code=403, detail="Not your snippet")
    await db.snippets.delete_one({"_id": ObjectId(snippet_id)})