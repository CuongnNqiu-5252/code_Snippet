from fastapi import APIRouter

from app.worker.ai_tasks import create_embedding

router = APIRouter(prefix="/test", tags=["test"])

@router.get("/abc")
async def create_abc():
    return await create_embedding("Hello word")