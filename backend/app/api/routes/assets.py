from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.asset import Asset, AssetCreate, AssetUpdate, AssetWithRisk
from app.services.asset_service import AssetService
from app.services.risk_service import RiskService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/assets", tags=["assets"])

@router.get("/", response_model=List[Asset])
def get_assets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all user assets"""
    return AssetService.get_user_assets(db, current_user.id)

@router.post("/", response_model=Asset)
async def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Register new asset"""
    # Verify NFT ownership
    is_owner = await AssetService.verify_nft_ownership(
        asset.nft_contract,
        asset.token_id,
        current_user.wallet_address
    )
    
    if not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't own this NFT"
        )
    
    return AssetService.create_asset(db, asset, current_user.id)

@router.get("/{asset_id}", response_model=AssetWithRisk)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get asset details with risk assessment"""
    asset = AssetService.get_asset_by_id(db, asset_id, current_user.id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    # Get latest risk assessment
    risk_service = RiskService()
    try:
        risk_data = risk_service.assess_asset_risk(db, asset_id)
        asset_dict = asset.__dict__
        asset_dict['risk_score'] = risk_data['risk_score']
        asset_dict['risk_factors'] = risk_data['risk_factors']
        return asset_dict
    except:
        return asset

@router.put("/{asset_id}", response_model=Asset)
def update_asset(
    asset_id: int,
    asset_update: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update asset information"""
    asset = AssetService.get_asset_by_id(db, asset_id, current_user.id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    return AssetService.update_asset(db, asset_id, asset_update)

@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete asset"""
    asset = AssetService.get_asset_by_id(db, asset_id, current_user.id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    AssetService.delete_asset(db, asset_id)
    return {"message": "Asset deleted successfully"}