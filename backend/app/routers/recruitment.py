from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.db import supabase
from app.models.recruitment import Candidate, CandidateCreate, CandidateUpdate

router = APIRouter(
    tags=["recruitment"],
    responses={404: {"description": "Not found"}},
)

@router.get("/candidates", response_model=List[Candidate])
def get_candidates():
    response = supabase.table("candidates").select("*").execute()
    return response.data

@router.post("/candidates", response_model=Candidate)
def create_candidate(candidate: CandidateCreate):
    response = supabase.table("candidates").insert(candidate.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not create candidate")
    return response.data[0]

@router.put("/candidates/{candidate_id}", response_model=Candidate)
def update_candidate(candidate_id: int, candidate: CandidateUpdate):
    # Using exclude_unset=True allows partial updates
    update_data = candidate.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
        
    response = supabase.table("candidates").update(update_data).eq("id", candidate_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return response.data[0]

@router.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int):
    response = supabase.table("candidates").delete().eq("id", candidate_id).execute()
    # Supabase delete response might be empty list if nothing deleted, or check count
    return {"message": "Candidate deleted"}
