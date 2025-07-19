# InsureGenie Backend

### Install and Run backend 

#### Option 1: Using PIP
```bash
# Create Virtual Environment
python -m venv .venv
.venv/Scripts/activate   # Windows
source .venv/bin/activate   # Mac/Linux

python -m pip install -r requirements.txt   # Install packages

python main.py  # To run project
```

#### Option 2: Using UV Python package manager
```bash
# Create Virtual Environment
uv venv
.venv/Scripts/activate   # Windows
source .venv/bin/activate   # Mac/Linux

uv add -r requirements.txt  # Install packages

uv run main.py  # Run project 
```

=======================
### 🗄️ BACKEND API STRUCTURE
=======================
## 🤖 1. Chatbot API

### Theory
AI assistant that understands user's assets and helps with insurance decisions.

### What it does
- Analyzes user messages
- Provides insurance guidance  
- Suggests next actions
- Remembers conversation context

### Code Structure
```python
@app.post("/api/chatbot")
async def chat_with_bot(message: str, wallet_address: str):
    # 1. Get user context (assets, policies)
    context = get_user_context(wallet_address)
    
    # 2. Call AI with context
    response = ai_chatbot.process(message, context)
    
    # 3. Save conversation
    save_chat_history(wallet_address, message, response)
    
    return response
```

### Request/Response
```json
// Request
{
  "message": "I want to insure my car",
  "wallet_address": "0x..."
}

// Response  
{
  "message": "I can help you insure your 1965 Aston Martin DB5!",
  "action": "analyze_asset",
  "next_steps": ["Get risk assessment", "Create policy"]
}
```

---

## 📊 2. Risk Assessment API

### Theory
Calculates insurance risk and premium based on asset details, location crime data, and market factors.

### What it does
- Analyzes asset risk factors
- Calculates monthly premium
- Provides risk explanation
- Caches results for speed

### Code Structure
```python
@app.post("/api/risk-assessment")
async def assess_risk(nft_contract: str, token_id: int, wallet_address: str):
    # 1. Check cache first
    cached = db.get_cached_assessment(nft_contract, token_id)
    if cached: return cached
    
    # 2. Get asset data
    asset = get_asset_data(nft_contract, token_id)
    
    # 3. Calculate risk components
    location_risk = get_crime_data(asset.postcode)
    age_risk = calculate_age_factor(asset.year)
    value_risk = calculate_value_factor(asset.value)
    
    # 4. Calculate premium
    risk_score = base_risk + location_risk + age_risk + value_risk
    premium = calculate_premium(asset.value, risk_score)
    
    # 5. Cache and return
    result = {"risk_score": risk_score, "premium": premium}
    db.cache_assessment(result)
    return result
```

### Request/Response
```json
// Request
{
  "nft_contract": "0x742d35cc...",
  "token_id": 456,
  "wallet_address": "0x..."
}

// Response
{
  "risk_score": 78,
  "monthly_premium": 156,
  "risk_factors": ["High value asset", "London location"],
  "coverage_recommendation": "comprehensive"
}
```

---

## ✅ 3. Ownership Verification API

### Theory
Verifies that wallet owns the NFT and matches real-world asset ownership.

### What it does
- Checks blockchain ownership
- Matches VIN numbers
- Calculates confidence score
- Verifies documents

### Code Structure
```python
@app.post("/api/verify-ownership")
async def verify_ownership(nft_contract: str, token_id: int, wallet_address: str):
    # 1. Get NFT data
    nft_data = get_nft_metadata(nft_contract, token_id)
    
    # 2. Check blockchain ownership
    is_owner = check_blockchain_owner(nft_contract, token_id, wallet_address)
    
    # 3. Verify VIN if provided
    vin_match = verify_vin_match(nft_data.vin, provided_vin)
    
    # 4. Calculate confidence
    confidence = 0
    if is_owner: confidence += 70
    if vin_match: confidence += 20
    if document_verified: confidence += 10
    
    return {
        "is_owner": is_owner,
        "confidence_score": confidence,
        "verification_status": "verified" if confidence > 80 else "pending"
    }
```

### Request/Response
```json
// Request
{
  "nft_contract": "0x742d35cc...",
  "token_id": 456,
  "wallet_address": "0x...",
  "vin": "SCFAB123456789" // optional
}

// Response
{
  "is_owner": true,
  "confidence_score": 90,
  "vin_match": true,
  "verification_status": "verified"
}
```

---

## 🏠 4. User Assets API

### Theory
Gets all tokenized assets owned by a wallet address.

### What it does
- Queries blockchain for NFTs
- Enriches with asset details
- Calculates total portfolio value
- Shows verification status

### Code Structure
```python
@app.get("/api/assets/{wallet_address}")
async def get_user_assets(wallet_address: str):
    # 1. Get NFTs from blockchain/dataset
    nfts = get_wallet_nfts(wallet_address)
    
    # 2. Enrich with details
    assets = []
    for nft in nfts:
        asset_details = get_asset_details(nft.contract, nft.token_id)
        assets.append({
            "token_id": nft.token_id,
            "name": asset_details.name,
            "value": asset_details.value,
            "verified": asset_details.verified
        })
    
    # 3. Calculate totals
    total_value = sum(asset.value for asset in assets)
    
    return {
        "assets": assets,
        "total_assets": len(assets),
        "total_value": total_value
    }
```

### Request/Response
```json
// Request
GET /api/assets/0x742d35Cc6634C0532925a3b8D3AC036EE9C38E5D

// Response
{
  "wallet_address": "0x742d35Cc...",
  "total_assets": 2,
  "total_value": 75000,
  "assets": [
    {
      "token_id": 456,
      "name": "1965 Aston Martin DB5",
      "value": 50000,
      "verified": true
    }
  ]
}
```

---

## 🏛️ 5. Policy Creation API

### Theory
Creates insurance policy metadata and prepares blockchain transaction data.

### What it does
- Generates policy metadata
- Calculates final premium
- Creates IPFS metadata
- Returns smart contract parameters

### Code Structure
```python
@app.post("/api/create-policy")
async def create_policy(asset_id: int, coverage_amount: int, duration_months: int):
    # 1. Get asset and risk data
    asset = get_asset(asset_id)
    risk_data = get_risk_assessment(asset_id)
    
    # 2. Generate policy metadata
    policy_metadata = {
        "name": f"Policy for {asset.name}",
        "coverage": coverage_amount,
        "premium": risk_data.premium,
        "start_date": today(),
        "end_date": today() + duration_months
    }
    
    # 3. Upload to IPFS
    metadata_uri = upload_to_ipfs(policy_metadata)
    
    # 4. Prepare contract parameters
    contract_params = {
        "assetId": asset_id,
        "coverageAmount": coverage_amount * 10**18,
        "duration": duration_months * 30 * 24 * 3600,
        "metadataURI": metadata_uri
    }
    
    return {
        "metadata_uri": metadata_uri,
        "contract_params": contract_params,
        "premium_amount": risk_data.premium
    }
```

### Request/Response
```json
// Request
{
  "asset_id": 456,
  "coverage_amount": 50000,
  "duration_months": 12,
  "wallet_address": "0x..."
}

// Response
{
  "policy_id": "POL-456-1234567890",
  "metadata_uri": "ipfs://QmPolicyHash...",
  "contract_params": {
    "assetId": 456,
    "coverageAmount": "50000000000000000000000",
    "duration": 31536000
  },
  "premium_amount": 156
}
```

---

## 📈 6. Platform Stats API

### Theory
Provides overview statistics for the insurance platform.

### What it does
- Counts total assets and policies
- Calculates platform metrics
- Shows risk distribution
- Tracks platform growth

### Code Structure
```python
@app.get("/api/stats")
async def get_platform_stats():
    # 1. Count assets
    total_assets = count_all_assets()
    verified_assets = count_verified_assets()
    
    # 2. Calculate values
    total_value = sum_all_asset_values()
    avg_premium = calculate_average_premium()
    
    # 3. Risk distribution
    risk_stats = {
        "low": count_assets_by_risk("low"),
        "medium": count_assets_by_risk("medium"), 
        "high": count_assets_by_risk("high")
    }
    
    return {
        "total_assets": total_assets,
        "total_value": total_value,
        "average_premium": avg_premium,
        "verified_assets": verified_assets,
        "risk_distribution": risk_stats
    }
```

### Request/Response
```json
// Request
GET /api/stats

// Response
{
  "total_assets": 2000,
  "total_value": 150000000,
  "average_premium": 95,
  "verified_assets": 1650,
  "risk_distribution": {
    "low": 800,
    "medium": 900,
    "high": 300
  }
}
```

---

## 🏥 7. Health Check API

### Theory
Simple endpoint to check if backend services are running properly.

### What it does
- Tests database connection
- Checks AI service
- Verifies data loading
- Returns system status

### Code Structure
```python
@app.get("/health")
async def health_check():
    # 1. Test database
    db_status = "ok" if test_database() else "error"
    
    # 2. Test AI service
    ai_status = "ok" if test_ai_service() else "error"
    
    # 3. Check data files
    data_status = "ok" if check_data_files() else "error"
    
    return {
        "status": "healthy" if all_ok else "degraded",
        "database": db_status,
        "ai_service": ai_status,
        "data_files": data_status,
        "timestamp": now()
    }
```

### Request/Response
```json
// Request
GET /health

// Response
{
  "status": "healthy",
  "database": "ok", 
  "ai_service": "ok",
  "data_files": "ok",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

---

## 🗄️ Database Design

### Simple SQLite Schema
```sql
-- Cache risk assessments
CREATE TABLE risk_cache (
    nft_contract TEXT,
    token_id INTEGER,
    risk_score REAL,
    premium INTEGER,
    created_at TIMESTAMP
);

-- Store chat history
CREATE TABLE chats (
    wallet_address TEXT,
    message TEXT,
    response TEXT,
    created_at TIMESTAMP
);

-- Track verifications
CREATE TABLE verifications (
    nft_contract TEXT,
    token_id INTEGER,
    wallet_address TEXT,
    verified BOOLEAN,
    confidence INTEGER
);
```

---

## 🚀 Quick Integration

### FastAPI Setup
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RWA Insurance API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Add all your endpoints here...
```

### Frontend Integration
```typescript
// Create API service
class InsuranceAPI {
  private baseUrl = 'http://localhost:8000';
  
  async chat(message: string, wallet: string) {
    return fetch(`${this.baseUrl}/api/chatbot`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message, wallet_address: wallet})
    }).then(r => r.json());
  }
  
  async getRiskAssessment(contract: string, tokenId: number, wallet: string) {
    return fetch(`${this.baseUrl}/api/risk-assessment`, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nft_contract: contract, token_id: tokenId, wallet_address: wallet})
    }).then(r => r.json());
  }
  
  // Add other methods...
}

export const api = new InsuranceAPI();
```

---

Each API is **independent** and can be implemented **step by step** as needed!
