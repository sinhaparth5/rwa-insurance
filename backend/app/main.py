from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, assets, policies, claims, risk, chat, dashboard
from app.config import get_settings
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title="RWA Insurance API",
    description="Blockchain-based insurance for real-world assets",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(assets.router)
app.include_router(policies.router)
app.include_router(claims.router)
app.include_router(risk.router)
app.include_router(chat.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "RWA Insurance API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}