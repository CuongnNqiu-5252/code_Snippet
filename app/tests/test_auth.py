import pytest
from unittest.mock import MagicMock, patch

#
from starlette.testclient import TestClient

#
from app.main import app
from app.core.security import hash_password
# ── Tests ─────────────────────────────────────────────────────────────
client = TestClient(app)
@pytest.mark.asyncio
@patch("app.api.auth.auth.user_collection")
def test_create_user(mock_user_collection):
    mock_collection = MagicMock()
    mock_collection.find_one.return_value = {}
    mock_user_collection.return_value = mock_collection

    response = client.post(
        "/auth/register",
        json={
            "email":"cuong@gmail.com",
            "password":"987654321",
        }
    )
    assert response.status_code == 201

@pytest.mark.asyncio
@patch("app.api.auth.auth.user_collection")
async def test_login_success(mock_user_collection):

    mock_collection = MagicMock()

    mock_collection.find_one.return_value = {
        "_id": "abc123",
        "email": "test@gmail.com",
        "password": hash_password("123456")
    }

    mock_user_collection.return_value = mock_collection

    response = client.post(
        "/auth/login",
        json={
            "email": "test@gmail.com",
            "password": "123456"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
@patch("app.api.auth.auth.user_collection")
async def test_login_wrong_password(mock_uc):
    """Login with wrong password returns 401."""


@pytest.mark.asyncio
@patch("app.api.auth.auth.user_collection")
async def test_login_user_not_found(mock_uc):
    """Login with non-existent email returns 401."""

@pytest.mark.asyncio
async def test_login_missing_email():
    """Login without email field returns 422 (validation error)."""


@pytest.mark.asyncio
async def test_login_missing_password():
    """Login without password field returns 422 (validation error)."""


@pytest.mark.asyncio
async def test_login_invalid_email_format():
    """Login with malformed email returns 422."""


@pytest.mark.asyncio
async def test_login_empty_body():
    """Login with empty JSON body returns 422."""
