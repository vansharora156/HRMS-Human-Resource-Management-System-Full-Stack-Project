from pydantic import BaseModel
from typing import Optional
from datetime import date

class AssetBase(BaseModel):
    name: str
    category: str
    serial_number: str
    assigned_to: Optional[int] = None
    status: str = "Available"
    purchase_date: Optional[date] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    serial_number: Optional[str] = None
    assigned_to: Optional[int] = None
    status: Optional[str] = None
    purchase_date: Optional[date] = None

class AssetResponse(AssetBase):
    id: int
    created_at: str

    class Config:
        from_attributes = True
