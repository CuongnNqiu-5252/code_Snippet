from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from app.core.database import user_collection
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import UserRegister, TokenResponse, UserLogin
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    tags=["auth"],
    summary="Register a new user",
    response_model_by_alias=True,
    responses={})
async def register(request: UserRegister):
    if  user_collection().find_one({"email": request.email}):
        raise HTTPException(status_code=409, detail="Email already registered")
    user_collection().insert_one({
        "email": request.email,
        "password": hash_password(request.password),
        "createdAt": datetime.now(timezone.utc),
    })
    return {"message": "Registered successfully"}


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = user_collection().find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=str(user["_id"]))
    return TokenResponse(access_token=token)
