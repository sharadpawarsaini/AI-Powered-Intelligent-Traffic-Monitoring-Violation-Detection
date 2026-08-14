from typing import List, Dict, Any
from app.config import settings

class TrafficAnalyticsService:
    def calculate_metrics(self, tracked_detections: List[Dict[str, Any]], tracker_service) -> Dict[str, Any]:
        counts_by_class = {
            "car": 0,
            "motorcycle": 0,
            "bus": 0,
            "truck": 0,
            "bicycle": 0,
            "person": 0
        }
        
        speeds = []
        for det in tracked_detections:
            c_name = det.get("class_name", "").lower()
            if c_name in counts_by_class:
                counts_by_class[c_name] += 1
            
            t_id = det.get("track_id")
            if t_id:
                vel_px, dist_px, direction = tracker_service.get_velocity_and_direction(t_id)
                det["direction"] = direction
                # Estimated Speed (m/s -> km/h)
                pixels_per_meter = settings.SPEED_CALIBRATION_PIXELS_PER_METER
                meters_per_sec = vel_px / max(pixels_per_meter, 1.0)
                estimated_kmh = meters_per_sec * 3.6
                det["estimated_speed_kmh"] = round(estimated_kmh, 1)
                if estimated_kmh > 2.0:
                    speeds.append(estimated_kmh)

        total_vehicles = sum([v for k, v in counts_by_class.items() if k != "person"])
        avg_speed = round(sum(speeds) / len(speeds), 1) if speeds else 0.0

        # Traffic Density Classification
        if total_vehicles <= 5:
            density = "LOW"
        elif total_vehicles <= 12:
            density = "MODERATE"
        elif total_vehicles <= 22:
            density = "HEAVY"
        else:
            density = "SEVERE"

        return {
            "total_vehicles": total_vehicles,
            "counts_by_class": counts_by_class,
            "average_speed_kmh": avg_speed,
            "traffic_density": density
        }

traffic_service = TrafficAnalyticsService()
