from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    designation_id: Optional[int] = None
    dept_id: Optional[int] = None
    company_id: Optional[int] = None
    emp_type_id: Optional[int] = None
    manager_id: Optional[int] = None
    joining_date: date
    status: str = "Active"

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    designation_id: Optional[int] = None
    dept_id: Optional[int] = None
    company_id: Optional[int] = None
    emp_type_id: Optional[int] = None
    manager_id: Optional[int] = None
    joining_date: Optional[date] = None
    status: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: str

    class Config:
        from_attributes = True
