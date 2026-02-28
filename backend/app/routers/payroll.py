from fastapi import APIRouter, HTTPException
from app.db import supabase
from app.models.payroll import PayrollCreate, PayrollResponse
from typing import List
from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/payroll", tags=["Payroll"])

@router.get("/", response_model=List[dict])
def get_payroll(employee_id: int = None):
    try:
        query = supabase.table("payroll").select("*")
        if employee_id:
            query = query.eq("employee_id", employee_id)
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Stub for report generation
@router.post("/generate-report")
def generate_report(employee_id: int):
    # In a real app, generate PDF here
    return {"message": "Report generated successfully", "download_url": "#"}

@router.post("/submit-proofs")
def submit_proofs(employee_id: int):
    # In a real app, handle file uploads here
    return {"message": "Investment proofs submitted successfully"}
