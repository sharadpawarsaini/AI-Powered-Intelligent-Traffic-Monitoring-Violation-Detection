from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserRole:
    ADMIN = "ADMIN"
    OPERATOR = "OPERATOR"
    VIEWER = "VIEWER"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = UserRole.OPERATOR

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

# Camera Schemas
class CameraBase(BaseModel):
    name: str
    location: str
    stream_url: Optional[str] = "webcam"
    status: str = "ACTIVE" # ACTIVE, INACTIVE, ERROR

class CameraCreate(CameraBase):
    pass

class CameraResponse(CameraBase):
    id: str
    created_at: datetime

# Vehicle Schemas
class VehicleResponse(BaseModel):
    id: str
    tracking_id: int
    vehicle_type: str
    plate_number: Optional[str] = "Not Detected"
    first_seen: datetime
    last_seen: datetime
    speed_kmh: Optional[float] = 0.0

# Traffic Event Schemas
class TrafficEventBase(BaseModel):
    event_type: str # VIOLATION, ACCIDENT, ANOMALY, CONGESTION
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    camera_id: str
    location: str
    vehicle_id: Optional[str] = None
    confidence: float
    severity: str = "MEDIUM" # LOW, MEDIUM, HIGH, CRITICAL
    description: str
    evidence_path: Optional[str] = None
    video_path: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}
    is_demo: bool = False

class TrafficEventResponse(TrafficEventBase):
    id: str

# Violation Schemas
class ViolationResponse(BaseModel):
    id: str
    event_id: str
    violation_type: str # NO_HELMET, WRONG_WAY, RED_LIGHT, ILLEGAL_PARKING, LANE_VIOLATION, TRIPLE_RIDING
    vehicle_id: Optional[str] = None
    confidence: float
    timestamp: datetime
    evidence_path: Optional[str] = None
    camera_location: Optional[str] = None

# Accident Schemas
class AccidentResponse(BaseModel):
    id: str
    event_id: str
    severity: str
    confidence: float
    vehicle_ids: List[int] = []
    timestamp: datetime
    evidence_path: Optional[str] = None
    location: Optional[str] = None

# Traffic Statistics Schemas
class TrafficStatisticsResponse(BaseModel):
    timestamp: datetime
    total_vehicles_today: int
    current_active_vehicles: int
    vehicle_counts_by_class: Dict[str, int]
    average_speed_kmh: float
    total_violations_today: int
    total_accidents_today: int
    traffic_density_level: str # LOW, MODERATE, HEAVY, SEVERE

# RAG & Assistant Schemas
class AssistantQueryRequest(BaseModel):
    query: str
    use_rag: bool = True

class AssistantQueryResponse(BaseModel):
    query: str
    answer: str
    retrieved_events: List[Dict[str, Any]] = []
    sql_executed: Optional[str] = None
    execution_time_ms: float
    source: str # HYBRID_RAG_SQL, SQL_ONLY, LLM_DIRECT, FALLBACK

# Model Management / Settings
class SystemSettingsUpdate(BaseModel):
    confidence_threshold: Optional[float] = None
    iou_threshold: Optional[float] = None
    frame_skip: Optional[int] = None
    accident_threshold: Optional[float] = None
    helmet_threshold: Optional[float] = None
    speed_pixels_per_meter: Optional[float] = None
