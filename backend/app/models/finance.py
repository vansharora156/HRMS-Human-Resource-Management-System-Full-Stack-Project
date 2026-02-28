from pydantic import BaseModel
from typing import Optional
from datetime import date

class ExpenseBase(BaseModel):
    employee_id: int
    category: str
    description: Optional[str] = None
    amount: float
    status: str = "Pending"
    claim_date: date

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: str # UUID
    created_at: str
