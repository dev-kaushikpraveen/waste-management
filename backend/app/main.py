from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.core.websocket import ws_manager
from app.api import auth, bins, iot, ai, batches, pickups, collections, rewards, marketplace, complaints, analytics
from app.seed.seed_data import seed_initial_data

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="EcoTrace 360: AI-Powered Smart Waste Management & Plastic Recycling Traceability Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(bins.router, prefix=settings.API_V1_STR)
app.include_router(iot.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(batches.router, prefix=settings.API_V1_STR)
app.include_router(pickups.router, prefix=settings.API_V1_STR)
app.include_router(collections.router, prefix=settings.API_V1_STR)
app.include_router(rewards.router, prefix=settings.API_V1_STR)
app.include_router(marketplace.router, prefix=settings.API_V1_STR)
app.include_router(complaints.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    # Automatically seed initial system data if database is clean
    seed_initial_data()

@app.get("/")
def root():
    return {
        "project": "EcoTrace 360",
        "tagline": "Every Waste Has a Journey. Every Plastic Has a Future.",
        "status": "ONLINE",
        "api_docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "EcoTrace 360 Backend", "database": "connected"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process client ping
            await websocket.send_text(f'{{"type": "PONG", "received": "{data}"}}')
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
