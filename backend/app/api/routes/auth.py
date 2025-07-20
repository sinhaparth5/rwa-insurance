from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.database import get_db
from app.schemas.user import UserLogin, User
from app.services.auth_service import (
    verify_wallet_signature,
    get_or_create_user,
    create_access_token
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Wallet-based authentication"""
    # Verify wallet signature
    if not verify_wallet_signature(
        login_data.wallet_address,
        login_data.message,
        login_data.signature
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature"
        )
    
    # Get or create user
    user = get_or_create_user(db, login_data.wallet_address)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": User.from_orm(user)
    }

@router.get("/profile", response_model=User)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user