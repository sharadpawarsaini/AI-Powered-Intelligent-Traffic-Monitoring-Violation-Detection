import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.services.db_service import db_service
from app.api import auth, cameras, detection, events, analytics, reports, assistant

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="AI-Powered Intelligent Traffic Monitoring, Violation Detection, Accident Detection & GenAI/RAG Platform"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount storage directory for direct evidence image & video serving
app.mount("/storage", StaticFiles(directory=settings.STORAGE_DIR), name="storage")

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(cameras.router, prefix=settings.API_V1_STR)
app.include_router(detection.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    print("[Server Startup] Initializing Unified Database Engine...")
    await db_service.initialize()

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "mongodb" if db_service.use_mongo else "sqlite_fallback",
        "project": settings.PROJECT_NAME
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
