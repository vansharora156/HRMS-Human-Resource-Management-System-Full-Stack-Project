from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class AttendanceBase(BaseModel):
    emp_id: int
    attendance_date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    check_out: Optional[datetime] = None

class AttendanceResponse(AttendanceBase):
    attendance_id: int

    class Config:
        from_attributes = True
