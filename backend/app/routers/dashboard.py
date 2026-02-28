from fastapi import APIRouter, HTTPException
from app.db import supabase
from datetime import date

router = APIRouter(tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats():
    try:
        # Total Employees
        emp_count = supabase.table("employees").select("*", count="exact").execute().count
        
        # Active Employees
        active_count = supabase.table("employees").select("*", count="exact").eq("status", "Active").execute().count

        # Present Today
        present_count = supabase.table("attendance").select("*", count="exact").eq("attendance_date", str(date.today())).execute().count

        # On Leave Today (Pending or Approved requests covering today)
        today = str(date.today())
        # Supabase filter for range overlap is a bit complex, let's just get approved leaves that start <= today and end >= today
        on_leave_count = supabase.table("leave_requests").select("*", count="exact").eq("status", "Approved").lte("from_date", today).gte("to_date", today).execute().count

        return {
            "total_employees": emp_count,
            "active_employees": active_count,
            "present_today": present_count,
            "on_leave_today": on_leave_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
