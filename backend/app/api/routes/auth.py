from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserLogin, User
from app.services.auth_service import (
    verify_wallet_signature,
    get_or_create_user,
    create_access_token
)
from app.api.dependencies import get_current_user, security
from app.config import get_settings
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime

settings = get_settings()
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
    
    # Create access token with user ID as string
    access_token = create_access_token(data={"sub": str(user.id)})  # Explicitly convert to string
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": User.from_orm(user)
    }

@router.post("/verify")
def verify_token(current_user: User = Depends(get_current_user)):
    """Verify JWT token"""
    return {"valid": True, "user": User.from_orm(current_user)}

@router.get("/profile", response_model=User)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user

@router.post("/debug-token")
def debug_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Debug token - shows what's in the token"""
    token = credentials.credentials
    
    try:
        # Decode without verification - still needs a key parameter
        unverified_payload = jwt.decode(
            token,
            settings.secret_key,  # Key is still required
            algorithms=[settings.algorithm],
            options={"verify_signature": False}
        )
        
        # Now try with verification
        try:
            verified_payload = jwt.decode(
                token, 
                settings.secret_key, 
                algorithms=[settings.algorithm]
            )
            
            return {
                "token_valid": True,
                "payload": verified_payload,
                "exp_timestamp": verified_payload.get("exp"),
                "exp_datetime": datetime.fromtimestamp(verified_payload.get("exp", 0)).isoformat() if verified_payload.get("exp") else None,
                "current_time": datetime.utcnow().isoformat(),
                "user_id": verified_payload.get("sub"),  # Expect string
                "secret_key_first_4": settings.secret_key[:4] + "...",  # Show first 4 chars for debugging
                "note": "sub is a string as per JWT specification"
            }
        except ExpiredSignatureError:
            exp = unverified_payload.get("exp", 0)
            return {
                "token_valid": False,
                "error": "Token expired",
                "exp_timestamp": exp,
                "exp_datetime": datetime.fromtimestamp(exp).isoformat(),
                "current_time": datetime.utcnow().isoformat(),
                "payload": unverified_payload
            }
        except JWTError as e:
            return {
                "token_valid": False,
                "error": f"Signature verification failed: {str(e)}",
                "unverified_payload": unverified_payload,
                "secret_key_first_4": settings.secret_key[:4] + "...",
            }
            
    except Exception as e:
        return {
            "token_valid": False,
            "error": f"Token decode failed: {str(e)}",
            "token_first_20": token[:20] + "..." if len(token) > 20 else token
        }