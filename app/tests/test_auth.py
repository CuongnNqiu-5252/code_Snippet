import pytest
from unittest.mock import patch, MagicMock

from httpx import AsyncClient, ASGITransport
from asgi_lifespan import LifespanManager

from app.main import app
from app.core.security import hash_password


# ── Fixtures ──────────────────────────────────────────────────────────

FAKE_USER = {
    "_id": "abc123",
    "email": "test@example.com",
    "password": hash_password("correctpassword"),
}


def _mock_collection(user_in_db=FAKE_USER):
    """Return a mock user_collection whose find_one behaves like Mongo."""
    col = MagicMock()

    def _find_one(query):
        if user_in_db and query.get("email") == user_in_db["email"]:
            return user_in_db
        return None

    col.find_one = MagicMock(side_effect=_find_one)
    return col


# ── Tests ─────────────────────────────────────────────────────────────

@pytest.mark.asyncio
@patch("app.api.auth.auth.user_collection")
async def test_login_success(mock_uc):
    """Login with correct credentials returns 200 + access_token."""
    mock_uc.return_value = _mock_collection()

    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/auth/login",
                json={
                    "email": "test@example.com",
                    "password": "correctpassword",
                },
            )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
@patch("app.api.auth.auth.user_collection")
async def test_login_wrong_password(mock_uc):
    """Login with wrong password returns 401."""
    mock_uc.return_value = _mock_collection()

    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/auth/login",
                json={
                    "email": "test@example.com",
                    "password": "wrongpassword",
                },
            )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
@patch("app.api.auth.auth.user_collection")
async def test_login_user_not_found(mock_uc):
    """Login with non-existent email returns 401."""
    mock_uc.return_value = _mock_collection()

    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/auth/login",
                json={
                    "email": "nonexistent@example.com",
                    "password": "whatever",
                },
            )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_login_missing_email():
    """Login without email field returns 422 (validation error)."""
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/auth/login",
                json={"password": "12345678"},
            )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_missing_password():
    """Login without password field returns 422 (validation error)."""
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/auth/login",
                json={"email": "test@example.com"},
            )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_invalid_email_format():
    """Login with malformed email returns 422."""
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/auth/login",
                json={
                    "email": "not-an-email",
                    "password": "12345678",
                },
            )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_empty_body():
    """Login with empty JSON body returns 422."""
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post("/auth/login", json={})

    assert response.status_code == 422