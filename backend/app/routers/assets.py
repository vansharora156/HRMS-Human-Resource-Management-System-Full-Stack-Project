from fastapi import APIRouter, HTTPException
from app.db import supabase
from app.models.assets import AssetCreate, AssetUpdate
from typing import List

router = APIRouter(tags=["Assets"])

@router.get("", response_model=List[dict])
def get_assets():
    try:
        response = supabase.table("assets").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=dict)
def create_asset(asset: AssetCreate):
    try:
        data = asset.model_dump(exclude_unset=True)
        # Convert date to string if needed, but Pydantic/Supabase usually handle it
        if data.get('purchase_date'):
            data['purchase_date'] = str(data['purchase_date'])
            
        response = supabase.table("assets").insert(data).execute()
        if not response.data:
             raise HTTPException(status_code=400, detail="Failed to create asset")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{asset_id}", response_model=dict)
def update_asset(asset_id: int, asset: AssetUpdate):
    try:
        data = asset.model_dump(exclude_unset=True)
        if data.get('purchase_date'):
            data['purchase_date'] = str(data['purchase_date'])
            
        response = supabase.table("assets").update(data).eq("id", asset_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Asset not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{asset_id}")
def delete_asset(asset_id: int):
    try:
        response = supabase.table("assets").delete().eq("id", asset_id).execute()
        return {"message": "Asset deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
