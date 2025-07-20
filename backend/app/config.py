from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./rwa_insurance.db"
    
    # Security
    secret_key: str = "7315f63c5931396e6a540a8da29f3923d05f7b1645ecd8b05c071773bbf37380"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Environment
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