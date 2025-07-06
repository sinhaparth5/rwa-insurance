# RWA Insurance Backend

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

Your backend team should create these API endpoints:

POST /api/users/profile
- Create/fetch user profile by wallet address
- Store user data in database

GET /api/assets?owner={address}
- Fetch user's tokenized assets
- Combine on-chain NFT data with off-chain metadata

POST /api/ai/chat
- Send message to AI LLM
- Return AI response with potential actions

GET /api/policies?owner={address}
- Fetch user's insurance policies
- Combine smart contract data with database records

POST /api/policies
- Create new insurance policy
- AI risk assessment + smart contract deployment

GET /api/claims?owner={address}
- Fetch user's claims history

POST /api/claims
- Submit new insurance claim
- Upload evidence to IPFS

Database Schema (PostgreSQL/MongoDB):
- users (wallet_address, profile_data, kyc_status)
- assets (token_id, owner, metadata, verification_status)
- policies (id, asset_id, owner, terms, smart_contract_address)
- claims (id, policy_id, type, amount, status, evidence_ipfs)
- ai_assessments (asset_id, risk_score, factors, timestamp)
/thname: '/**',
/ =======================
// 🗄️ BACKEND API STRUCTURE (for your team)
// =======================

/*
Your backend team should create these API endpoints:

POST /api/users/profile
- Create/fetch user profile by wallet address
- Store user data in database

GET /api/assets?owner={address}
- Fetch user's tokenized assets
- Combine on-chain NFT data with off-chain metadata

POST /api/ai/chat
- Send message to AI LLM
- Return AI response with potential actions

GET /api/policies?owner={address}
- Fetch user's insurance policies
- Combine smart contract data with database records

POST /api/policies
- Create new insurance policy
- AI risk assessment + smart contract deployment

GET /api/claims?owner={address}
- Fetch user's claims history

POST /api/claims
- Submit new insurance claim
- Upload evidence to IPFS

Database Schema (PostgreSQL/MongoDB):
- users (wallet_address, profile_data, kyc_status)
- assets (token_id, owner, metadata, verification_status)
- policies (id, asset_id, owner, terms, smart_contract_address)
- claims (id, policy_id, type, amount, status, evidence_ipfs)
- ai_assessments (asset_id, risk_score, factors, timestamp)
*/
