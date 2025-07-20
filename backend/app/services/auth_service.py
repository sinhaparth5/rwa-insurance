from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings
from app.models.user import User
from sqlalchemy.orm import Session

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    # Do NOT convert sub to integer; keep it as a string
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])  # Ensure sub is a string
    
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def verify_wallet_signature(wallet_address: str, message: str, signature: str) -> bool:
    """Verify wallet signature (simplified for demo)"""
    # In production, use web3.py to verify actual signatures
    # For demo, just check if signature exists
    return len(signature) > 0

def get_or_create_user(db: Session, wallet_address: str) -> User:
    """Get existing user or create new one"""
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    if not user:
        user = User(wallet_address=wallet_address)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user