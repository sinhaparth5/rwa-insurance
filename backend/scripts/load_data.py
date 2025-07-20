#!/usr/bin/env python
"""Load sample data from CSV files"""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

import pandas as pd
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models.user import User
from app.models.assets import Asset
from datetime import datetime

def load_sample_data():
    """Load sample data from CSV files"""
    db = SessionLocal()
    
    try:
        # Load vehicle data
        vehicles_df = pd.read_csv('data/raw/onchain_vehicles_blockdag.csv')
        
        print(f"Loading {len(vehicles_df)} vehicles...")
        
        # Create users and assets
        for _, row in vehicles_df.iterrows():
            # Create or get user
            user = db.query(User).filter(
                User.wallet_address == row['owner_wallet_address']
            ).first()
            
            if not user:
                user = User(wallet_address=row['owner_wallet_address'])
                db.add(user)
                db.commit()
            
            # Check if asset already exists
            existing_asset = db.query(Asset).filter(
                Asset.nft_contract == row['contract_address'],
                Asset.token_id == row['token_id']
            ).first()
            
            if not existing_asset:
                # Create asset
                asset = Asset(
                    user_id=user.id,
                    nft_contract=row['contract_address'],
                    token_id=row['token_id'],
                    asset_type=row['category'],
                    name=f"{row['year']} {row['make']} {row['model']}",
                    description=f"VIN: {row['vin']}",
                    current_value=row['current_value'],
                    location=row['area'],
                    postcode=row['postcode'],
                    verification_status='verified' if row['ownership_verified'] else 'pending',
                    make=row['make'],
                    model=row['model'],
                    year=row['year'],
                    vin=row['vin'],
                    registration_number=row['registration_number'],
                    mileage=row['mileage'],
                    fuel_type=row['fuel_type']
                )
                db.add(asset)
        
        db.commit()
        print("Sample data loaded successfully!")
        
    except Exception as e:
        print(f"Error loading data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_sample_data()