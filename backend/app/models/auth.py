from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = ""

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = ""
    created_at: Optional[str] = None

class SessionResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_at: int

class AuthResponse(BaseModel):
    user: UserResponse
    session: Optional[SessionResponse] = None
