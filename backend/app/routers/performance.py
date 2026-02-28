from fastapi import APIRouter, HTTPException
from app.db import supabase
from app.models.performance import GoalCreate, GoalResponse
from typing import List
from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/performance", tags=["Performance"])

@router.get("/goals", response_model=List[dict])
def get_goals(employee_id: int = None):
    try:
        query = supabase.table("goals").select("*")
        if employee_id:
            query = query.eq("employee_id", employee_id)
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/goals", response_model=dict)
def create_goal(goal: GoalCreate):
    try:
        data = jsonable_encoder(goal)
        response = supabase.table("goals").insert(data).execute()
        if not response.data:
             raise HTTPException(status_code=400, detail="Failed to create goal")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
