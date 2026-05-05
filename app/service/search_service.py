from typing import List, Optional
from bson import ObjectId

from app.core.database import get_db
from app.models.snippet import SnippetOut
from app.service.snippet_service import _serialize


async def keyword_search(
    query: str,
    user_id: str,
    language: Optional[str] = None,
    limit: int = 20,
) -> List[SnippetOut]:
    """
    Phase 1: MongoDB $text search on title + tags (index created at startup).
    Phase 2: replace / augment with semantic search via embeddings.
    """
    db = get_db()

    match: dict = {
        "$text": {"$search": query},
        "$or": [
            {"createdBy": ObjectId(user_id)},
            {"isPublic": True},
        ],
    }
    if language:
        match["language"] = language

    cursor = (
        db.snippets.find(match, {"score": {"$meta": "textScore"}})
        .sort([("score", {"$meta": "textScore"})])
        .limit(limit)
    )
    return [_serialize(doc) async for doc in cursor]