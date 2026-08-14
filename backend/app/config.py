import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Intelligent Traffic Monitoring & GenAI Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "super-secret-key-change-in-production-traffic-ai-2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALGORITHM: str = "HS256"

    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "traffic_ai_db"
    USE_FALLBACK_DB_IF_MONGO_DISCONNECTED: bool = True
    SQLITE_DB_PATH: str = "data/traffic_ai.db"

    # Vision & ML
    YOLO_MODEL_PATH: str = "yolov8n.pt"
    CONFIDENCE_THRESHOLD: float = 0.40
    IOU_THRESHOLD: float = 0.45
    FRAME_SKIP: int = 2
    MAX_DETECTIONS: int = 100

    # Thresholds
    HELMET_CONFIDENCE_THRESHOLD: float = 0.50
    PARKING_THRESHOLD_SECONDS: float = 10.0
    ACCIDENT_SCORE_THRESHOLD: float = 0.65
    SPEED_CALIBRATION_PIXELS_PER_METER: float = 15.0

    # GenAI
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    VECTOR_STORE_PATH: str = "storage/vector_store"

    # Storage Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    STORAGE_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "storage")
    ACCIDENTS_DIR: str = os.path.join(STORAGE_DIR, "accidents")
    VIOLATIONS_DIR: str = os.path.join(STORAGE_DIR, "violations")
    PLATES_DIR: str = os.path.join(STORAGE_DIR, "number_plates")
    PROCESSED_VIDEOS_DIR: str = os.path.join(STORAGE_DIR, "processed_videos")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure storage directories exist
for path in [
    settings.STORAGE_DIR,
    settings.ACCIDENTS_DIR,
    settings.VIOLATIONS_DIR,
    settings.PLATES_DIR,
    settings.PROCESSED_VIDEOS_DIR,
    settings.VECTOR_STORE_PATH,
    os.path.join(os.path.dirname(settings.BASE_DIR), "data")
]:
    os.makedirs(path, exist_ok=True)
