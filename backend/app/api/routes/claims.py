from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.claim import Claim, ClaimCreate, ClaimUpdate
from app.services.claim_service import ClaimService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/claims", tags=["claims"])

@router.get("/", response_model=List[Claim])
def get_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all user claims"""
    return ClaimService.get_user_claims(db, current_user.id)

@router.post("/", response_model=Claim)
def submit_claim(
    claim: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit new claim"""
    # Verify user owns the policy
    from app.services.policy_service import PolicyService
    from app.services.asset_service import AssetService
    
    policy = PolicyService.get_policy_by_id(db, claim.policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    asset = AssetService.get_asset_by_id(db, policy.asset_id, current_user.id)
    if not asset:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return ClaimService.create_claim(db, claim)

@router.get("/{claim_id}", response_model=Claim)
def get_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get claim details"""
    claims = ClaimService.get_user_claims(db, current_user.id)
    claim = next((c for c in claims if c.id == claim_id), None)
    
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return claim

@router.put("/{claim_id}/status")
def update_claim_status(
    claim_id: int,
    update: ClaimUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update claim status (admin only in production)"""
    claim = ClaimService.update_claim_status(db, claim_id, update.status)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return {"message": f"Claim status updated to {update.status}"}
    # RWA Insurance Backend - Complete Python Implementation
