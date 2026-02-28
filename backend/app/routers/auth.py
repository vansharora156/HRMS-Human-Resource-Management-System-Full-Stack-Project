import os
import httpx
import logging
from fastapi import APIRouter, HTTPException, Request
from app.db import supabase
from app.config import settings
from app.models.auth import SignupRequest, LoginRequest, RefreshRequest, AuthResponse, UserResponse, SessionResponse
from typing import Optional, Dict, Any, Tuple

router = APIRouter(prefix="/api/auth", tags=["Auth"])
logger = logging.getLogger(__name__)

_SUPABASE_URL = settings.SUPABASE_URL
_SUPABASE_KEY = settings.SUPABASE_KEY
_SERVICE_KEY = settings.SUPABASE_SERVICE_KEY or _SUPABASE_KEY

_HEADERS = {
    "apikey": _SERVICE_KEY,
    "Authorization": f"Bearer {_SERVICE_KEY}",
    "Content-Type": "application/json",
}

def _try_confirm_email(email: str) -> bool:
    try:
        r = httpx.get(
            f"{_SUPABASE_URL}/auth/v1/admin/users",
            headers=_HEADERS,
            timeout=10,
        )
        if r.status_code != 200:
            return False

        users = r.json().get("users", [])
        user = next((u for u in users if u.get("email") == email), None)
        if not user:
            return False

        uid = user["id"]
        patch = httpx.put(
            f"{_SUPABASE_URL}/auth/v1/admin/users/{uid}",
            headers=_HEADERS,
            json={"email_confirm": True},
            timeout=10,
        )
        return patch.status_code == 200
    except Exception as e:
        logger.error(f"Error confirming email: {e}")
        return False

def _direct_signin(email: str, password: str) -> Optional[Dict[str, Any]]:
    try:
        r = httpx.post(
            f"{_SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers={
                "apikey": _SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json={"email": email, "password": password},
            timeout=10,
        )
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        logger.error(f"Direct signin failed: {e}")
    return None

def _signup_direct(email: str, password: str, full_name: str = "") -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    try:
        r = httpx.post(
            f"{_SUPABASE_URL}/auth/v1/signup",
            headers={
                "apikey": _SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json={
                "email": email,
                "password": password,
                "data": {"full_name": full_name},
            },
            timeout=10,
        )
        result = r.json()

        if r.status_code not in (200, 201):
            return None, result.get("msg") or result.get("error_description") or str(result)

        # Step 2: Try to auto-confirm via admin API
        _try_confirm_email(email)

        # Step 3: Try to sign in to get a session
        signin = _direct_signin(email, password)
        if signin and signin.get("access_token"):
            return signin, None

        return result, None

    except Exception as e:
        return None, str(e)

@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(body: SignupRequest):
    email = body.email.strip()
    password = body.password
    full_name = body.full_name.strip() if body.full_name else ""

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    result, error = _signup_direct(email, password, full_name)

    if error:
        low = error.lower()
        if "already" in low or "registered" in low:
            raise HTTPException(status_code=409, detail="An account with this email already exists")
        raise HTTPException(status_code=400, detail=error)

    if result is None:
        raise HTTPException(status_code=400, detail="Sign up failed. Please try again.")

    user_data = result.get("user") or {}
    metadata = user_data.get("user_metadata") or {}

    return {
        "user": {
            "id": user_data.get("id", result.get("id", "")),
            "email": user_data.get("email", email),
            "full_name": metadata.get("full_name", full_name),
            "created_at": user_data.get("created_at"),
        },
        "session": {
            "access_token": result.get("access_token", ""),
            "refresh_token": result.get("refresh_token", ""),
            "expires_at": result.get("expires_at", 0),
        } if result.get("access_token") else None,
    }

@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    email = body.email.strip()
    password = body.password

    try:
        # SDK attempt
        result = supabase.auth.sign_in_with_password({"email": email, "password": password})
        user = result.user
        session = result.session

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.user_metadata.get("full_name", ""),
                "created_at": user.created_at.isoformat() if user.created_at else None,
            },
            "session": {
                "access_token": session.access_token,
                "refresh_token": session.refresh_token,
                "expires_at": session.expires_at,
            },
        }

    except Exception as e:
        err_msg = str(e).lower()
        if "email not confirmed" in err_msg:
            # Attempt to confirm and sign in manually
            confirmed = _try_confirm_email(email)
            if confirmed:
                signin = _direct_signin(email, password)
                if signin and signin.get("access_token"):
                    user_data = signin.get("user", {})
                    metadata = user_data.get("user_metadata", {})
                    return {
                        "user": {
                            "id": user_data.get("id", ""),
                            "email": user_data.get("email", email),
                            "full_name": metadata.get("full_name", ""),
                            "created_at": user_data.get("created_at"),
                        },
                        "session": {
                            "access_token": signin["access_token"],
                            "refresh_token": signin.get("refresh_token", ""),
                            "expires_at": signin.get("expires_at", 0),
                        },
                    }
            raise HTTPException(status_code=401, detail="Email not confirmed. Please check your email.")
        
        if "invalid" in err_msg or "credentials" in err_msg:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh", response_model=AuthResponse)
async def refresh(body: RefreshRequest):
    try:
        result = supabase.auth.refresh_session(body.refresh_token)
        user = result.user
        session = result.session

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.user_metadata.get("full_name", ""),
            },
            "session": {
                "access_token": session.access_token,
                "refresh_token": session.refresh_token,
                "expires_at": session.expires_at,
            },
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")

@router.get("/me")
async def me(request: Request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = auth_header.split(" ", 1)[1]
    try:
        result = supabase.auth.get_user(token)
        user = result.user
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.user_metadata.get("full_name", ""),
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
