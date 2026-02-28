from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CandidateCreate(BaseModel):
    full_name: str
    email: str
    role: str
    status: str = "Applied"
    rating: int = 0
    resume_url: Optional[str] = None

class CandidateUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[int] = None
    resume_url: Optional[str] = None

class Candidate(CandidateCreate):
    id: int
    created_at: datetime
