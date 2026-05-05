from enum import Enum
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class SnippetState(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    INACTIVE = "inactive"
class SnippetCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    code: str = Field(..., min_length=1)
    programming_language: str = Field(..., min_length=1, max_length=50)
    tags: List[str] = []
    is_public: bool = True


class SnippetUpdate(BaseModel):
    title: Optional[str] = None
    code: Optional[str] = None
    language: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None


class SnippetOut(BaseModel):
    id: str
    title: str
    code: str
    language: str
    tags: List[str]
    is_public: bool
    created_by: str
    created_at: datetime
    updated_at: datetime

    summary: Optional[str] = None
    status: SnippetState = SnippetState.PENDING  # pending | done