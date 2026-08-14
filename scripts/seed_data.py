import os
import sys
import asyncio
from datetime import datetime, timedelta
import random

# Add backend directory to sys.path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.append(backend_dir)

from app.config import settings
from app.services.db_service import db_service
from app.services.auth_service import get_password_hash
from app.models.schemas import UserRole

async def seed_database():
    print("[Seed] Initializing Database connection...")
    await db_service.initialize()

    # 1. Seed Default Users
    users_to_seed = [
        {"name": "System Administrator", "email": "admin@traffic.ai", "password_hash": get_password_hash("admin123"), "role": UserRole.ADMIN},
        {"name": "Traffic Operator", "email": "operator@traffic.ai", "password_hash": get_password_hash("operator123"), "role": UserRole.OPERATOR},
        {"name": "Analytics Viewer", "email": "viewer@traffic.ai", "password_hash": get_password_hash("viewer123"), "role": UserRole.VIEWER}
    ]

    for u in users_to_seed:
        existing = await db_service.get_user_by_email(u["email"])
        if not existing:
            await db_service.create_user(u)
            print(f"[Seed] Created User: {u['email']} ({u['role']})")

    # 2. Seed Cameras
    cameras = [
        {"name": "Cam 01 - Main Junction North", "location": "Main St & 5th Ave", "stream_url": "webcam", "status": "ACTIVE"},
        {"name": "Cam 02 - Highway Expressway East", "location": "Route 66 Mile 12", "stream_url": "demo", "status": "ACTIVE"},
        {"name": "Cam 03 - University Gate Crossing", "location": "College Blvd West", "stream_url": "demo", "status": "ACTIVE"},
        {"name": "Cam 04 - Commercial Hub Plaza", "location": "Market St & 9th Ave", "stream_url": "demo", "status": "ACTIVE"},
        {"name": "Cam 05 - Industrial Corridor South", "location": "Ring Road Sector 4", "stream_url": "demo", "status": "ACTIVE"}
    ]

    camera_ids = []
    for c in cameras:
        created = await db_service.create_camera(c)
        camera_ids.append(created["id"])
        print(f"[Seed] Created Camera: {c['name']}")

    # 3. Seed Traffic Violations & Events
    violation_types = ["NO_HELMET", "WRONG_WAY", "RED_LIGHT", "ILLEGAL_PARKING", "LANE_VIOLATION", "TRIPLE_RIDING"]
    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    vehicle_types = ["car", "motorcycle", "bus", "truck"]

    now = datetime.utcnow()
    print("[Seed] Generating 100+ DEMO DATA traffic events and violations...")

    for i in range(120):
        t_delta = timedelta(hours=random.randint(0, 48), minutes=random.randint(0, 59))
        event_time = now - t_delta
        v_type = random.choice(violation_types)
        c_id = random.choice(camera_ids)
        veh_id = f"{random.randint(10, 99)}"
        conf = round(random.uniform(0.80, 0.98), 2)
        sev = random.choice(severities)

        event_dict = {
            "event_type": "VIOLATION",
            "timestamp": event_time.isoformat(),
            "camera_id": c_id,
            "location": f"Camera Junction #{c_id[:4]}",
            "vehicle_id": veh_id,
            "confidence": conf,
            "severity": sev,
            "description": f"[DEMO DATA] Detected traffic violation: {v_type} by vehicle ID #{veh_id}",
            "evidence_path": f"storage/violations/VIOLATION_DEMO_{i+1:03d}.jpg",
            "metadata": {"violation_type": v_type, "demo": True},
            "is_demo": True
        }
        created_event = await db_service.create_event(event_dict)

        violation_dict = {
            "event_id": created_event["id"],
            "violation_type": v_type,
            "vehicle_id": veh_id,
            "confidence": conf,
            "timestamp": event_time.isoformat(),
            "evidence_path": f"storage/violations/VIOLATION_DEMO_{i+1:03d}.jpg",
            "camera_location": f"Camera Junction #{c_id[:4]}"
        }
        await db_service.create_violation(violation_dict)

    # 4. Seed Accident Events
    print("[Seed] Generating DEMO DATA accident records...")
    for j in range(25):
        t_delta = timedelta(hours=random.randint(0, 72), minutes=random.randint(0, 59))
        event_time = now - t_delta
        c_id = random.choice(camera_ids)
        v1_id = random.randint(10, 50)
        v2_id = random.randint(51, 99)
        conf = round(random.uniform(0.75, 0.96), 2)
        sev = random.choice(["HIGH", "CRITICAL"])

        event_dict = {
            "event_type": "ACCIDENT",
            "timestamp": event_time.isoformat(),
            "camera_id": c_id,
            "location": f"Highway Segment #{c_id[:4]}",
            "vehicle_id": str(v1_id),
            "confidence": conf,
            "severity": sev,
            "description": f"[DEMO DATA] Potential Accident Collision logged between Vehicle #{v1_id} and Vehicle #{v2_id}",
            "evidence_path": f"storage/accidents/ACC_DEMO_{j+1:03d}.jpg",
            "metadata": {"vehicle_ids": [v1_id, v2_id], "demo": True},
            "is_demo": True
        }
        created_event = await db_service.create_event(event_dict)

        accident_dict = {
            "event_id": created_event["id"],
            "severity": sev,
            "confidence": conf,
            "vehicle_ids": [v1_id, v2_id],
            "timestamp": event_time.isoformat(),
            "evidence_path": f"storage/accidents/ACC_DEMO_{j+1:03d}.jpg",
            "location": f"Highway Segment #{c_id[:4]}"
        }
        await db_service.create_accident(accident_dict)

    print("[Seed] Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
