from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.models.schemas import TrafficEventResponse, ViolationResponse, AccidentResponse
from app.services.db_service import db_service
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/events", tags=["Events & Incidents"])

@router.get("", response_model=List[TrafficEventResponse])
async def get_traffic_events(
    limit: int = Query(100, ge=1, le=500),
    event_type: Optional[str] = None,
    severity: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    events = await db_service.get_events(limit=limit, event_type=event_type, severity=severity)
    return events

@router.get("/violations", response_model=List[ViolationResponse])
async def get_violations(
    limit: int = Query(100, ge=1, le=500),
    current_user=Depends(get_current_user)
):
    violations = await db_service.get_violations(limit=limit)
    return violations

@router.get("/accidents", response_model=List[AccidentResponse])
async def get_accidents(
    limit: int = Query(100, ge=1, le=500),
    current_user=Depends(get_current_user)
):
    accidents = await db_service.get_accidents(limit=limit)
    return accidents
