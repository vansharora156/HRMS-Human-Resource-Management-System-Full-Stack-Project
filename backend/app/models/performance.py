from pydantic import BaseModel
from typing import Optional
from datetime import date

class GoalBase(BaseModel):
    employee_id: int
    title: str
    description: Optional[str] = None
    status: str = "In Progress"
    progress_percent: int = 0
    due_date: Optional[date] = None

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: str  # UUID
    created_at: str
