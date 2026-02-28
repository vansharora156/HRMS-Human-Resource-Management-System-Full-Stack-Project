from fastapi import APIRouter, HTTPException
from app.db import supabase
from app.models.finance import ExpenseCreate, ExpenseResponse
from typing import List
from fastapi.encoders import jsonable_encoder

router = APIRouter(tags=["Finance"])

@router.get("/expenses", response_model=List[dict])
def get_expenses(employee_id: int = None):
    try:
        query = supabase.table("expenses").select("*")
        if employee_id:
            query = query.eq("employee_id", employee_id)
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/expenses", response_model=dict)
def create_expense(expense: ExpenseCreate):
    try:
        data = jsonable_encoder(expense)
        response = supabase.table("expenses").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create expense claim")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
