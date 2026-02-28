from fastapi import APIRouter, HTTPException
from app.db import supabase
from app.models.attendance import AttendanceCreate, AttendanceUpdate, AttendanceResponse
from typing import List
from datetime import date
from fastapi.encoders import jsonable_encoder

router = APIRouter(tags=["Attendance"])

@router.post("/check-in", response_model=dict)
def check_in(attendance: AttendanceCreate):
    try:
        # Check if already checked in today
        existing = supabase.table("attendance").select("*").eq("emp_id", attendance.emp_id).eq("attendance_date", str(date.today())).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Already checked in today")
        
        # Serialize entry for Supabase
        data = jsonable_encoder(attendance)
        response = supabase.table("attendance").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/check-out", response_model=dict)
def check_out(emp_id: int, update: AttendanceUpdate):
    try:
        # Find today's attendance record
        existing = supabase.table("attendance").select("*").eq("emp_id", emp_id).eq("attendance_date", str(date.today())).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="No check-in record found for today")
        
        att_id = existing.data[0]['attendance_id']
        data = jsonable_encoder(update)
        response = supabase.table("attendance").update(data).eq("attendance_id", att_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{emp_id}", response_model=List[dict])
def get_attendance(emp_id: int):
    try:
        response = supabase.table("attendance").select("*").eq("emp_id", emp_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
