import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train_risk_model():
    """Train the risk assessment model"""
    # Load data
    vehicles_df = pd.read_csv('data/raw/onchain_vehicles_blockdag.csv')
    crime_df = pd.read_csv('data/raw/london_vehicle_crimes_sample.csv')
    
    # Aggregate crime data by postcode
    crime_rates = crime_df.groupby('postcode')['borough_crime_rate'].mean().to_dict()
    
    # Prepare features
    features = []
    targets = []
    
    for _, row in vehicles_df.iterrows():
        # Extract features
        year = row['year']
        current_value = row['current_value']
        mileage = row['mileage']
        area_crime_rate = crime_rates.get(row['postcode'], 50)
        is_luxury = 1 if row['category'] == 'luxury' else 0
        is_sports = 1 if row['category'] == 'sports' else 0
        is_verified = 1 if row['ownership_verified'] else 0
        
        fuel_type_map = {'Petrol': 0, 'Diesel': 1, 'Hybrid': 2, 'Electric': 3}
        fuel_type_encoded = fuel_type_map.get(row['fuel_type'], 0)
        
        risk_level_map = {'low': 0, 'medium': 1, 'high': 2, 'very high': 3}
        location_risk_encoded = risk_level_map.get(row['area_risk_level'].lower(), 1)
        
        feature_vector = [
            year, current_value, mileage, area_crime_rate,
            is_luxury, is_sports, is_verified,
            fuel_type_encoded, location_risk_encoded
        ]
        
        features.append(feature_vector)
        targets.append(row['insurance_risk_score'])
    
    # Convert to numpy arrays
    X = np.array(features)
    y = np.array(targets)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Risk Model - Train R²: {train_score:.3f}, Test R²: {test_score:.3f}")
    
    # Save model
    os.makedirs('data/models', exist_ok=True)
    joblib.dump(model, 'data/models/risk_model.pkl')
    
    return model

if __name__ == "__main__":
    train_risk_model()