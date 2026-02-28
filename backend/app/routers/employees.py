from fastapi import APIRouter, HTTPException, Depends
from app.db import supabase
from app.models.employees import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from typing import List

router = APIRouter(tags=["Employees"])

@router.get("", response_model=List[dict])
def get_employees():
    try:
        response = supabase.table("employees").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=dict)
def create_employee(employee: EmployeeCreate):
    try:
        emp_data = employee.model_dump(exclude_unset=True)
        response = supabase.table("employees").insert(emp_data).execute()
        if not response.data:
             raise HTTPException(status_code=400, detail="Failed to create employee")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{emp_id}", response_model=dict)
def get_employee(emp_id: int):
    try:
        # Using 'id' as per schema
        response = supabase.table("employees").select("*").eq("id", emp_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Employee not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{emp_id}", response_model=dict)
def update_employee(emp_id: int, employee: EmployeeUpdate):
    try:
        update_data = employee.model_dump(exclude_unset=True)
        response = supabase.table("employees").update(update_data).eq("id", emp_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Employee not found or update failed")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{emp_id}")
def delete_employee(emp_id: int):
    try:
        response = supabase.table("employees").delete().eq("id", emp_id).execute()
        # Supabase API doesn't always return data on delete, but we check if it didn't error
        return {"message": "Employee deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
