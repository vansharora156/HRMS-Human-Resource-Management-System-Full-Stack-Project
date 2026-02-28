from pydantic import BaseModel
from typing import Optional
from datetime import date

class LeaveRequestBase(BaseModel):
    emp_id: int
    leave_type_id: int
    from_date: date
    to_date: date
    status: str = "Pending"

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestUpdate(BaseModel):
    status: Optional[str] = None

class LeaveRequestResponse(LeaveRequestBase):
    request_id: int

    class Config:
        from_attributes = True

class LeaveBalanceResponse(BaseModel):
    balance_id: int
    emp_id: int
    leave_type_id: int
    balance: int

    class Config:
        from_attributes = True
