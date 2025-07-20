from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.assets import Asset
from app.schemas.asset import AssetCreate, AssetUpdate
import httpx

class AssetService:
    @staticmethod
    def get_user_assets(db: Session, user_id: int) -> List[Asset]:
        """Get all assets for a user"""
        return db.query(Asset).filter(Asset.user_id == user_id).all()
    
    @staticmethod
    def get_asset_by_id(db: Session, asset_id: int, user_id: int) -> Optional[Asset]:
        """Get specific asset by ID"""
        return db.query(Asset).filter(
            Asset.id == asset_id,
            Asset.user_id == user_id
        ).first()
    
    @staticmethod
    def create_asset(db: Session, asset: AssetCreate, user_id: int) -> Asset:
        """Create new asset"""
        db_asset = Asset(**asset.dict(), user_id=user_id)
        db.add(db_asset)
        db.commit()
        db.refresh(db_asset)
        return db_asset
    
    @staticmethod
    def update_asset(db: Session, asset_id: int, asset_update: AssetUpdate) -> Optional[Asset]:
        """Update existing asset"""
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
        if asset:
            for field, value in asset_update.dict(exclude_unset=True).items():
                setattr(asset, field, value)
            db.commit()
            db.refresh(asset)
        return asset
    
    @staticmethod
    def delete_asset(db: Session, asset_id: int) -> bool:
        """Delete asset"""
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
        if asset:
            db.delete(asset)
            db.commit()
            return True
        return False
    
    @staticmethod
    async def verify_nft_ownership(contract_address: str, token_id: int, 
                                  wallet_address: str) -> bool:
        """Verify NFT ownership on blockchain"""
        # In production, use web3.py to check actual ownership
        # For demo, return True
        return True