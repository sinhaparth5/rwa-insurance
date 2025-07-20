import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

def train_premium_model():
    """Train the premium calculation model"""
    # Load data
    vehicles_df = pd.read_csv('data/raw/onchain_vehicles_blockdag.csv')
    
    # Prepare features
    features = []
    targets = []
    
    for _, row in vehicles_df.iterrows():
        # Features: risk_score, coverage_amount, asset_value
        risk_score = row['insurance_risk_score']
        coverage_amount = row['current_value'] * 0.8  # 80% coverage
        asset_value = row['current_value']
        
        feature_vector = [risk_score, coverage_amount, asset_value]
        features.append(feature_vector)
        targets.append(row['monthly_premium_estimate'])
    
    # Convert to numpy arrays
    X = np.array(features)
    y = np.array(targets)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = XGBRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Premium Model - Train R²: {train_score:.3f}, Test R²: {test_score:.3f}")
    
    # Save model
    os.makedirs('data/models', exist_ok=True)
    joblib.dump(model, 'data/models/premium_model.pkl')
    
    return model

if __name__ == "__main__":
    train_premium_model()