from typing import List, Optional
from fastapi import APIRouter, Depends, Query

from app.core.security import get_current_user
from app.models.snippet import SnippetOut
from app.service.search_service import keyword_search
from fastapi import HTTPException
router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=List[SnippetOut])
async def search(
    q: str = Query(..., min_length=1),
    language: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    user=Depends(get_current_user),
):
    return keyword_search(q, (user), language=language, limit=limit)


# Phase 2 placeholder — returns 501 until AI is wired up
@router.get("/semantic", response_model=List[SnippetOut])
async def semantic_search(
    q: str = Query(..., min_length=1),
    user=Depends(get_current_user),
):

    raise HTTPException(status_code=501, detail="Semantic search available in Phase 2")