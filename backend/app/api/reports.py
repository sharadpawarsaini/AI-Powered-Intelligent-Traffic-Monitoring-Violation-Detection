import os
import io
import csv
from datetime import datetime
from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse, FileResponse
from app.services.db_service import db_service
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

@router.get("/daily/csv")
async def export_daily_report_csv(current_user=Depends(get_current_user)):
    events = await db_service.get_events(limit=500)
    violations = await db_service.get_violations(limit=500)
    accidents = await db_service.get_accidents(limit=500)

    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write CSV Header
    writer.writerow(["Report Date", datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")])
    writer.writerow([])
    writer.writerow(["EVENT SUMMARY"])
    writer.writerow(["Total Events Logged", len(events)])
    writer.writerow(["Total Violations Logged", len(violations)])
    writer.writerow(["Total Potential Accidents", len(accidents)])
    writer.writerow([])
    
    writer.writerow(["VIOLATIONS LIST"])
    writer.writerow(["ID", "Violation Type", "Vehicle ID", "Confidence", "Timestamp", "Location"])
    for v in violations:
        writer.writerow([v.get("id"), v.get("violation_type"), v.get("vehicle_id"), v.get("confidence"), v.get("timestamp"), v.get("camera_location", "Main Road")])

    writer.writerow([])
    writer.writerow(["ACCIDENTS LIST"])
    writer.writerow(["ID", "Severity", "Confidence", "Vehicle IDs", "Timestamp", "Location"])
    for a in accidents:
        writer.writerow([a.get("id"), a.get("severity"), a.get("confidence"), str(a.get("vehicle_ids")), a.get("timestamp"), a.get("location", "Main Intersection")])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=traffic_report_{datetime.utcnow().strftime('%Y%m%d')}.csv"}
    )
