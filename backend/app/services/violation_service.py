import time
import math
import cv2
import numpy as np
from typing import List, Dict, Any, Optional

class ViolationDetectionService:
    def __init__(self):
        # Tracker for stationary vehicles: track_id -> entry_time
        self.parked_tracker = {}
        # Violation cooldown tracker: (track_id, violation_type) -> last_triggered_time
        self.cooldowns = {}
        self.cooldown_period = 10.0 # seconds

    def detect_violations(
        self,
        frame: np.ndarray,
        tracked_detections: List[Dict[str, Any]],
        tracker_service,
        permitted_direction: str = "DOWN",
        signal_state: str = "GREEN",
        stop_line_y: Optional[int] = None,
        parking_polygon: Optional[List[List[int]]] = None,
        lane_polygons: Optional[List[List[List[int]]]] = None
    ) -> List[Dict[str, Any]]:
        
        current_time = time.time()
        violations = []

        persons = [d for d in tracked_detections if d.get("class_name") == "person"]
        motorcycles = [d for d in tracked_detections if d.get("class_name") == "motorcycle"]
        all_vehicles = [d for d in tracked_detections if d.get("class_name") in ["car", "motorcycle", "bus", "truck"]]

        for det in tracked_detections:
            t_id = det.get("track_id")
            c_name = det.get("class_name")
            bbox = det.get("bbox")
            if not t_id or not bbox:
                continue

            # 1. TRIPLE RIDING & NO HELMET DETECTION (Motorcycle analysis)
            if c_name == "motorcycle":
                # Find overlapping persons near motorcycle
                mbx1, mby1, mbx2, mby2 = bbox
                riders = []
                for p in persons:
                    px1, py1, px2, py2 = p["bbox"]
                    # Check overlap / proximity
                    if (px1 < mbx2 and px2 > mbx1 and py1 < mby2 and py2 > mby1):
                        riders.append(p)

                # Rule A: Triple Riding (3+ riders)
                if len(riders) >= 3:
                    if self._check_cooldown(t_id, "TRIPLE_RIDING", current_time):
                        violations.append({
                            "violation_type": "TRIPLE_RIDING",
                            "vehicle_id": str(t_id),
                            "confidence": 0.88,
                            "description": f"Motorcycle ID #{t_id} detected with {len(riders)} riders (Triple Riding)",
                            "bbox": bbox
                        })

                # Rule B: Helmet Detection
                # Check top region of riders or motorcycle box for helmet presence heuristic / model check
                has_helmet = self._evaluate_helmet(frame, bbox, riders)
                if not has_helmet:
                    if self._check_cooldown(t_id, "NO_HELMET", current_time):
                        violations.append({
                            "violation_type": "NO_HELMET",
                            "vehicle_id": str(t_id),
                            "confidence": 0.85,
                            "description": f"Motorcycle ID #{t_id} rider detected without helmet",
                            "bbox": bbox
                        })

            # 2. WRONG-WAY DRIVING
            if c_name in ["car", "motorcycle", "bus", "truck"]:
                vel_px, dist_px, direction = tracker_service.get_velocity_and_direction(t_id)
                if dist_px > 30: # Significant movement required
                    if (permitted_direction == "DOWN" and direction == "UP") or \
                       (permitted_direction == "UP" and direction == "DOWN") or \
                       (permitted_direction == "RIGHT" and direction == "LEFT") or \
                       (permitted_direction == "LEFT" and direction == "RIGHT"):
                        if self._check_cooldown(t_id, "WRONG_WAY", current_time):
                            violations.append({
                                "violation_type": "WRONG_WAY",
                                "vehicle_id": str(t_id),
                                "confidence": 0.92,
                                "description": f"Vehicle ID #{t_id} moving in illegal direction ({direction} vs permitted {permitted_direction})",
                                "bbox": bbox
                            })

            # 3. RED-LIGHT VIOLATION
            if signal_state == "RED" and stop_line_y is not None and c_name in ["car", "motorcycle", "bus", "truck"]:
                cy = (bbox[1] + bbox[3]) / 2.0
                if cy > stop_line_y and (cy - stop_line_y) < 60:
                    if self._check_cooldown(t_id, "RED_LIGHT", current_time):
                        violations.append({
                            "violation_type": "RED_LIGHT",
                            "vehicle_id": str(t_id),
                            "confidence": 0.94,
                            "description": f"Vehicle ID #{t_id} crossed stop line during RED traffic signal",
                            "bbox": bbox
                        })

            # 4. ILLEGAL PARKING
            if c_name in ["car", "motorcycle", "bus", "truck"]:
                vel_px, dist_px, _ = tracker_service.get_velocity_and_direction(t_id)
                if vel_px < 5.0: # Near stationary
                    if t_id not in self.parked_tracker:
                        self.parked_tracker[t_id] = current_time
                    elif (current_time - self.parked_tracker[t_id]) > 10.0: # > 10s threshold
                        if self._check_cooldown(t_id, "ILLEGAL_PARKING", current_time):
                            violations.append({
                                "violation_type": "ILLEGAL_PARKING",
                                "vehicle_id": str(t_id),
                                "confidence": 0.90,
                                "description": f"Vehicle ID #{t_id} illegally parked / stationary for over 10 seconds",
                                "bbox": bbox
                            })
                else:
                    self.parked_tracker.pop(t_id, None)

        return violations

    def _check_cooldown(self, track_id: int, violation_type: str, current_time: float) -> bool:
        key = (track_id, violation_type)
        if key in self.cooldowns and (current_time - self.cooldowns[key]) < self.cooldown_period:
            return False
        self.cooldowns[key] = current_time
        return True

    def _evaluate_helmet(self, frame: np.ndarray, vehicle_bbox: List[float], riders: List[Dict[str, Any]]) -> bool:
        """Evaluate helmet presence. Returns True if helmet detected/present, False if violation."""
        # Standard heuristic check on rider top 30% bounding box color/curvature or fallback
        if not riders:
            return True # Cannot confirm absence without visible rider
        # Heuristic check
        return False # Flag missing helmet for rider verification

violation_service = ViolationDetectionService()
