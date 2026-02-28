from pydantic import BaseModel
from typing import Optional

class PayrollBase(BaseModel):
    employee_id: int
    month: str
    basic_salary: float
    net_pay: float
    status: str = "Draft"

class PayrollCreate(PayrollBase):
    pass

class PayrollResponse(PayrollBase):
    id: str # UUID
    created_at: str
