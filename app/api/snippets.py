from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status

from app.core.security import get_current_user
from app.models.snippet import SnippetCreate, SnippetOut, SnippetUpdate
from app.service import snippet_service

router = APIRouter(prefix="/snippets", tags=["snippets"])


@router.post("", response_model=SnippetOut, status_code=status.HTTP_201_CREATED)
async def create(data: SnippetCreate, user=Depends(get_current_user)):
    return await snippet_service.create_snippet(data, user)


@router.get("", response_model=List[SnippetOut])
async def list_all(
    language: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user=Depends(get_current_user),
):
    return await snippet_service.list_snippets(
        str(user["_id"]), language=language, tag=tag, skip=skip, limit=limit
    )


@router.get("/{snippet_id}", response_model=SnippetOut)
async def get_one(snippet_id: str, user=Depends(get_current_user)):
    return await snippet_service.get_snippet(snippet_id, str(user["_id"]))


@router.put("/{snippet_id}", response_model=SnippetOut)
async def update(snippet_id: str, data: SnippetUpdate, user=Depends(get_current_user)):
    return await snippet_service.update_snippet(snippet_id, data, str(user["_id"]))


@router.delete("/{snippet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(snippet_id: str, user=Depends(get_current_user)):
    await snippet_service.delete_snippet(snippet_id, str(user["_id"]))