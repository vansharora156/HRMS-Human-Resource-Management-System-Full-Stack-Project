from fastapi import APIRouter, HTTPException, Request
from app.db import supabase
from typing import List, Optional, Any, Dict

def create_crud_router(table_name: str, pk: str = "id", prefix: str = "") -> APIRouter:
    router = APIRouter(prefix=prefix, tags=[table_name.replace("_", "-").title()])

    @router.get("", response_model=List[Dict[str, Any]])
    async def list_rows(request: Request):
        try:
            query = supabase.table(table_name).select("*")
            for key, value in request.query_params.items():
                query = query.eq(key, value)
            response = query.execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @router.get("/{id_val}", response_model=Dict[str, Any])
    async def get_row(id_val: Any):
        try:
            response = supabase.table(table_name).select("*").eq(pk, id_val).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Not found")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @router.post("", response_model=List[Dict[str, Any]], status_code=201)
    async def create_row(body: Dict[str, Any]):
        try:
            response = supabase.table(table_name).insert(body).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @router.put("/{id_val}", response_model=List[Dict[str, Any]])
    async def update_row(id_val: Any, body: Dict[str, Any]):
        try:
            response = supabase.table(table_name).update(body).eq(pk, id_val).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Not found or update failed")
            return response.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @router.delete("/{id_val}")
    async def delete_row(id_val: Any):
        try:
            response = supabase.table(table_name).delete().eq(pk, id_val).execute()
            return {"message": "Deleted", "data": response.data}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router
