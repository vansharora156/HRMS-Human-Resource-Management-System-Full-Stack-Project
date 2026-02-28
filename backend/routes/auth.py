"""
Authentication routes — sign-up, login, and session validation
using Supabase Auth.

When email confirmation is enabled in Supabase but no SMTP is
configured, users get stuck in "email not confirmed" state.
This module works around that by:
  1. Trying the normal sign_in_with_password first.
  2. On "email not confirmed", falling back to a direct GoTrue
     REST call to confirm the user and then retrying login.
"""

import os
import httpx
from flask import Blueprint, request, jsonify
from config import supabase

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# GoTrue REST helpers ──────────────────────────────────────────────
_SUPABASE_URL = os.getenv("SUPABASE_URL", "")
_SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
_SERVICE_KEY  = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "") or _SUPABASE_KEY

_HEADERS = {
    "apikey": _SERVICE_KEY,
    "Authorization": f"Bearer {_SERVICE_KEY}",
    "Content-Type": "application/json",
}


def _try_confirm_email(email: str) -> bool:
    """Attempt to confirm a user's email via the GoTrue Admin API.
    Returns True if successful, False otherwise."""
    try:
        # 1. Find the user by listing users
        r = httpx.get(
            f"{_SUPABASE_URL}/auth/v1/admin/users",
            headers=_HEADERS,
            verify=False,
            timeout=10,
        )
        if r.status_code != 200:
            return False

        users = r.json().get("users", [])
        user = next((u for u in users if u.get("email") == email), None)
        if not user:
            return False

        # 2. Confirm the user's email
        uid = user["id"]
        patch = httpx.put(
            f"{_SUPABASE_URL}/auth/v1/admin/users/{uid}",
            headers=_HEADERS,
            json={"email_confirm": True},
            verify=False,
            timeout=10,
        )
        return patch.status_code == 200
    except Exception:
        return False


def _direct_signin(email: str, password: str):
    """Sign in via the GoTrue REST API directly, returning the
    JSON response dict or None on failure."""
    try:
        r = httpx.post(
            f"{_SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers={
                "apikey": _SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            json={"email": email, "password": password},
            verify=False,
            timeout=10,
        )
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return None


def _signup_direct(email: str, password: str, full_name: str = ""):
    """Sign up via the GoTrue REST API directly and auto-confirm
    if the service-role key is available."""
    try:
        # Step 1: Create the user via REST
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
            verify=False,
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

        # If sign-in fails, return the signup result (may have session)
        if result.get("access_token"):
            return result, None

        return result, None

    except Exception as e:
        return None, str(e)


# ── Routes ────────────────────────────────────────────────────────

@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user with email & password via Supabase Auth."""
    try:
        body = request.get_json(force=True)
        email = body.get("email", "").strip()
        password = body.get("password", "")
        full_name = body.get("full_name", "").strip()

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        result, error = _signup_direct(email, password, full_name)

        if error:
            low = error.lower()
            if "already" in low or "registered" in low:
                return jsonify({"error": "An account with this email already exists"}), 409
            return jsonify({"error": error}), 400

        if result is None:
            return jsonify({"error": "Sign up failed. Please try again."}), 400

        # Build response — result may be from signup or signin
        user_data = result.get("user") or {}
        metadata = user_data.get("user_metadata") or {}

        return jsonify({
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
        }), 201

    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower():
            return jsonify({"error": "An account with this email already exists"}), 409
        return jsonify({"error": error_msg}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Sign in with email & password via Supabase Auth."""
    try:
        body = request.get_json(force=True)
        email = body.get("email", "").strip()
        password = body.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # ── Attempt 1: normal SDK sign-in ────────────────────────
        try:
            result = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password,
            })

            user = result.user
            session = result.session

            return jsonify({
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
            }), 200

        except Exception as sdk_err:
            err_msg = str(sdk_err).lower()

            # ── Not an email-confirmation issue → re-raise ───────
            if "email not confirmed" not in err_msg:
                raise sdk_err

        # ── Attempt 2: auto-confirm the email, then retry ────────
        confirmed = _try_confirm_email(email)

        if confirmed:
            # Retry sign-in after confirming
            signin = _direct_signin(email, password)
            if signin and signin.get("access_token"):
                user_data = signin.get("user", {})
                metadata = user_data.get("user_metadata", {})
                return jsonify({
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
                }), 200

        # ── Attempt 3: re-signup to get a fresh session ──────────
        try:
            re_signup = supabase.auth.sign_up({
                "email": email,
                "password": password,
            })
            if re_signup.session:
                user = re_signup.user
                session = re_signup.session
                return jsonify({
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
                }), 200
        except Exception:
            pass

        # All attempts failed
        return jsonify({
            "error": "Email not confirmed. Please check your email or create a new account."
        }), 401

    except Exception as e:
        error_msg = str(e)
        if "invalid" in error_msg.lower() or "credentials" in error_msg.lower():
            return jsonify({"error": "Invalid email or password"}), 401
        return jsonify({"error": error_msg}), 500


@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    """Refresh an expired access token using a refresh token."""
    try:
        body = request.get_json(force=True)
        refresh_token = body.get("refresh_token", "")

        if not refresh_token:
            return jsonify({"error": "Refresh token is required"}), 400

        result = supabase.auth.refresh_session(refresh_token)

        user = result.user
        session = result.session

        return jsonify({
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
        }), 200

    except Exception as e:
        return jsonify({"error": "Session expired. Please log in again."}), 401


@auth_bp.route("/me", methods=["GET"])
def me():
    """Get current user info from a valid access token."""
    try:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        token = auth_header.split(" ", 1)[1]
        result = supabase.auth.get_user(token)

        user = result.user
        return jsonify({
            "id": user.id,
            "email": user.email,
            "full_name": user.user_metadata.get("full_name", ""),
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }), 200
    except Exception as e:
        return jsonify({"error": "Invalid or expired token"}), 401
