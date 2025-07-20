from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.policy import Policy, PolicyCreate, PolicyUpdate
from app.services.policy_service import PolicyService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/policies", tags=["policies"])

@router.get("/", response_model=List[Policy])
def get_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all user policies"""
    return PolicyService.get_user_policies(db, current_user.id)

@router.post("/", response_model=Policy)
def create_policy(
    policy: PolicyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new insurance policy"""
    # Verify user owns the asset
    from app.services.asset_service import AssetService
    asset = AssetService.get_asset_by_id(db, policy.asset_id, current_user.id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    return PolicyService.create_policy(db, policy)

@router.get("/{policy_id}", response_model=Policy)
def get_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get policy details"""
    policy = PolicyService.get_policy_by_id(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    # Verify user owns the policy
    from app.services.asset_service import AssetService
    asset = AssetService.get_asset_by_id(db, policy.asset_id, current_user.id)
    if not asset:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return policy

@router.put("/{policy_id}/pay")
def pay_premium(
    policy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process premium payment"""
    policy = PolicyService.get_policy_by_id(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    # In production, integrate with payment processor
    # For demo, just return success
    return {
        "message": "Premium payment processed successfully",
        "policy_id": policy_id,
        "amount": policy.premium_amount
    }