import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: Optional[str] = None
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "https://hrms-frontend.vercel.app"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
