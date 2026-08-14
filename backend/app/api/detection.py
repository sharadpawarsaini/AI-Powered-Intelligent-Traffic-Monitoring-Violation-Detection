import os
import cv2
import time
import uuid
import numpy as np
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse, FileResponse
from typing import Optional, List, Dict, Any

from app.config import settings
from app.services.auth_service import get_current_user
from app.services.detection_service import detection_service
from app.services.tracking_service import tracking_service
from app.services.traffic_service import traffic_service
from app.services.violation_service import violation_service
from app.services.accident_service import accident_service
from app.services.ocr_service import ocr_service
from app.services.alert_service import alert_service
from app.services.db_service import db_service

router = APIRouter(prefix="/detection", tags=["Computer Vision & Video Stream"])

# Store active streaming/processing status
active_streams = {}

@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".mp4", ".avi", ".mov", ".mkv", ".jpg", ".jpeg", ".png"]:
        raise HTTPException(status_code=400, detail=f"Unsupported file format '{ext}'")

    file_id = f"{uuid.uuid4()}{ext}"
    target_path = os.path.join(settings.PROCESSED_VIDEOS_DIR, file_id)

    with open(target_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {
        "message": "File uploaded successfully",
        "file_id": file_id,
        "filename": file.filename,
        "path": target_path
    }

def generate_video_stream(video_source: str = "demo"):
    """MJPEG stream generator for live computer vision monitoring UI."""
    if video_source == "webcam":
        cap = cv2.VideoCapture(0)
    elif os.path.exists(video_source):
        cap = cv2.VideoCapture(video_source)
    else:
        # Demo synthetic frame stream if video path is not local file
        cap = None

    frame_count = 0
    while True:
        if cap and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0) # Loop video
                continue
        else:
            # Generate synthetic demo frame with moving vehicles
            frame = np.zeros((720, 1280, 3), dtype=np.uint8)
            cv2.rectangle(frame, (100, 100), (1180, 620), (40, 40, 40), -1) # Road
            cv2.line(frame, (640, 100), (640, 620), (255, 255, 255), 4) # Divider
            
            # Draw moving demo vehicles
            t = time.time()
            car_y = int(200 + (t * 120) % 380)
            bike_y = int(500 - (t * 90) % 380)
            
            cv2.rectangle(frame, (350, car_y), (480, car_y + 110), (0, 165, 255), -1) # Car
            cv2.putText(frame, "Car", (360, car_y + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            cv2.rectangle(frame, (750, bike_y), (820, bike_y + 80), (255, 0, 128), -1) # Motorcycle
            cv2.putText(frame, "Motorcycle", (755, bike_y + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        frame_count += 1
        if frame_count % settings.FRAME_SKIP == 0:
            # 1. Run YOLO Object Detection
            detections = detection_service.detect_frame(frame)

            # 2. Run ByteTrack Persistent Multi-Object Tracking
            tracked = tracking_service.update(detections)

            # 3. Traffic Analytics & Speed Estimation
            metrics = traffic_service.calculate_metrics(tracked, tracking_service)

            # 4. Violation Detection
            violations = violation_service.detect_violations(
                frame, tracked, tracking_service, permitted_direction="DOWN", signal_state="GREEN"
            )
            for v in violations:
                alert_service.trigger_alert(
                    title=f"Traffic Violation: {v['violation_type']}",
                    message=v["description"],
                    severity="HIGH"
                )

            # 5. Potential Accident Detection Engine
            accidents = accident_service.detect_potential_accidents(frame, tracked, tracking_service)
            for a in accidents:
                alert_service.trigger_alert(
                    title="🚨 Potential Accident Detected",
                    message=a["description"],
                    severity=a["severity"]
                )

            # Draw visual bounding box overlays
            for item in tracked:
                bbox = item.get("bbox", [0, 0, 0, 0])
                t_id = item.get("track_id", 0)
                cls_name = item.get("class_name", "")
                conf = item.get("confidence", 0.0)
                speed = item.get("estimated_speed_kmh", 0.0)

                x1, y1, x2, y2 = [int(coord) for coord in bbox]
                color = (0, 255, 0) if cls_name == "car" else (255, 165, 0) if cls_name == "motorcycle" else (0, 255, 255)
                
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                label = f"{cls_name.upper()} #{t_id} | {speed} km/h"
                cv2.putText(frame, label, (x1, max(y1 - 10, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            # Overlay stream telemetry box
            cv2.rectangle(frame, (20, 20), (380, 110), (0, 0, 0), -1)
            cv2.putText(frame, f"LIVE MONITORING | FPS: 30", (30, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
            cv2.putText(frame, f"Vehicles: {metrics['total_vehicles']} | Density: {metrics['traffic_density']}", (30, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            cv2.putText(frame, f"Avg Speed: {metrics['average_speed_kmh']} km/h", (30, 95), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.03)

@router.get("/stream")
async def video_stream(source: str = "demo"):
    return StreamingResponse(
        generate_video_stream(source),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
