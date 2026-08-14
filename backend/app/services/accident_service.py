import time
import math
import cv2
import numpy as np
from typing import List, Dict, Any, Optional
from app.config import settings

class AccidentDetectionEngine:
    def __init__(self):
        self.cooldowns = {}
        self.cooldown_period = 15.0 # seconds

    def detect_potential_accidents(
        self,
        frame: np.ndarray,
        tracked_detections: List[Dict[str, Any]],
        tracker_service
    ) -> List[Dict[str, Any]]:
        current_time = time.time()
        accidents = []
        vehicles = [d for d in tracked_detections if d.get("class_name") in ["car", "motorcycle", "bus", "truck"]]

        for i in range(len(vehicles)):
            for j in range(i + 1, len(vehicles)):
                v1 = vehicles[i]
                v2 = vehicles[j]
                
                t_id1 = v1.get("track_id")
                t_id2 = v2.get("track_id")
                if not t_id1 or not t_id2:
                    continue

                b1 = v1["bbox"]
                b2 = v2["bbox"]

                # 1. Bounding Box Overlap Score (IoU / Overlap area)
                overlap_score = self._calculate_bbox_overlap(b1, b2)

                # 2. Velocity Delta / Sudden Deceleration Score
                v1_vel, _, _ = tracker_service.get_velocity_and_direction(t_id1)
                v2_vel, _, _ = tracker_service.get_velocity_and_direction(t_id2)
                velocity_score = self._calculate_velocity_change_score(v1_vel, v2_vel)

                # 3. Trajectory Deviation Score
                trajectory_score = self._calculate_trajectory_score(v1, v2)

                # Total Accident Score
                accident_score = (overlap_score * 0.40) + (velocity_score * 0.35) + (trajectory_score * 0.25)

                if accident_score >= settings.ACCIDENT_SCORE_THRESHOLD:
                    cooldown_key = tuple(sorted([t_id1, t_id2]))
                    if self._check_cooldown(cooldown_key, current_time):
                        severity = "CRITICAL" if accident_score > 0.85 else "HIGH" if accident_score > 0.75 else "MEDIUM"
                        accidents.append({
                            "event_type": "ACCIDENT",
                            "severity": severity,
                            "confidence": round(accident_score, 2),
                            "vehicle_ids": [t_id1, t_id2],
                            "description": f"Potential Collision / Accident detected between Vehicle #{t_id1} ({v1['class_name']}) and Vehicle #{t_id2} ({v2['class_name']})",
                            "bboxes": [b1, b2]
                        })

        return accidents

    def _calculate_bbox_overlap(self, b1: List[float], b2: List[float]) -> float:
        x_left = max(b1[0], b2[0])
        y_top = max(b1[1], b2[1])
        x_right = min(b1[2], b2[2])
        y_bottom = min(b1[3], b2[3])

        if x_right < x_left or y_bottom < y_top:
            return 0.0

        intersection_area = (x_right - x_left) * (y_bottom - y_top)
        area1 = (b1[2] - b1[0]) * (b1[3] - b1[1])
        area2 = (b2[2] - b2[0]) * (b2[3] - b2[1])
        min_area = min(area1, area2)

        if min_area <= 0:
            return 0.0

        overlap_ratio = intersection_area / min_area
        return min(overlap_ratio * 1.2, 1.0)

    def _calculate_velocity_change_score(self, v1_vel: float, v2_vel: float) -> float:
        # Sudden velocity drop or abnormal relative speed close to collision
        rel_vel = abs(v1_vel - v2_vel)
        if rel_vel > 60:
            return 0.90
        elif rel_vel > 30:
            return 0.70
        return 0.20

    def _calculate_trajectory_score(self, v1: Dict[str, Any], v2: Dict[str, Any]) -> float:
        dir1 = v1.get("direction", "")
        dir2 = v2.get("direction", "")
        if dir1 and dir2 and dir1 != dir2:
            return 0.85
        return 0.30

    def _check_cooldown(self, key: tuple, current_time: float) -> bool:
        if key in self.cooldowns and (current_time - self.cooldowns[key]) < self.cooldown_period:
            return False
        self.cooldowns[key] = current_time
        return True

accident_service = AccidentDetectionEngine()
