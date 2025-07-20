from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str = "sqlite:///./rwa_insurance.db"

    secret_key: str = "your_secret_key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    environment: str = "development"
    debug: bool = True

     # ML Models
    risk_model_path: str = "data/models/risk_model.pkl"
    premium_model_path: str = "data/models/premium_model.pkl"
    chatbot_model_path: str = "data/models/chatbot_model"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()