from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import CameraCreate, CameraResponse, UserRole
from app.services.db_service import db_service
from app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.get("", response_model=List[CameraResponse])
async def list_cameras(current_user=Depends(get_current_user)):
    cameras = await db_service.get_cameras()
    return cameras

@router.post("", response_model=CameraResponse)
async def create_camera(
    camera_in: CameraCreate,
    current_user=Depends(require_role([UserRole.ADMIN, UserRole.OPERATOR]))
):
    camera_dict = camera_in.model_dump()
    created = await db_service.create_camera(camera_dict)
    return created
