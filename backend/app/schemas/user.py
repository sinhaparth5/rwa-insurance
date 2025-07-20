from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    wallet_address: str
    email: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    email: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    wallet_address: str
    signature: str
    message: str