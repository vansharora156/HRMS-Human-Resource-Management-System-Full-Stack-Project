from fastapi import APIRouter, HTTPException
from app.db import supabase
from app.models.leave import LeaveRequestCreate, LeaveRequestUpdate
from typing import List

router = APIRouter(tags=["Leave"])

@router.post("/apply", response_model=dict)
def apply_leave(leave: LeaveRequestCreate):
    try:
        leave_data = leave.model_dump(exclude_unset=True)
        # Convert date objects to string format (YYYY-MM-DD) for JSON serialization
        if leave_data.get('from_date'):
            leave_data['from_date'] = leave_data['from_date'].isoformat()
        if leave_data.get('to_date'):
            leave_data['to_date'] = leave_data['to_date'].isoformat()
            
        response = supabase.table("leave_requests").insert(leave_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{emp_id}", response_model=List[dict])
def get_leave_history(emp_id: int):
    try:
        response = supabase.table("leave_requests").select("*, leave_types(name)").eq("emp_id", emp_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{request_id}/status", response_model=dict)
def update_leave_status(request_id: int, update: LeaveRequestUpdate):
    try:
        response = supabase.table("leave_requests").update(update.model_dump(exclude_unset=True)).eq("request_id", request_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balances/{emp_id}", response_model=List[dict])
def get_leave_balances(emp_id: int):
    try:
        response = supabase.table("leave_balances").select("*, leave_types(name)").eq("emp_id", emp_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
