import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Gourmet Haven Restaurant Digital Menu & Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-jwt-change-in-production-12345678")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Dual database support: PostgreSQL in production/docker, SQLite for instant zero-dependency local run
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./restaurant.db")
    
    # Static & media upload storage
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    STATIC_URL_PREFIX: str = "/uploads"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
