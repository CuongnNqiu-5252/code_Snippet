import os
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext

# Cấu hình bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__truncate_error=False)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

ALGORITHM = os.getenv("ALGORITHM", "HS256")


def _pre_hash_password(password: str) -> str:
    """Hàm phụ trợ để băm sơ bộ mật khẩu bằng SHA-256"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def hash_password(password: str):
    # Đưa mật khẩu qua SHA-256 trước, sau đó mới dùng bcrypt
    pre_hashed = _pre_hash_password(password)
    return pwd_context.hash(pre_hashed)


def verify_password(plain_password, hashed_password):
    # Khi kiểm tra cũng phải băm sơ bộ mật khẩu nhập vào
    pre_hashed = _pre_hash_password(plain_password)
    return pwd_context.verify(pre_hashed, hashed_password)


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES"),))
    )
    return jwt.encode({"sub": subject, "exp": expire}, os.getenv("SECRET_KEY"), algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        secret_key = os.getenv("SECRET_KEY", "your-super-secret-key-for-dev")
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        return user_id
    except JWTError:
        raise credentials_exception