import math
import time
from typing import List, Dict, Any

class ByteTrackService:
    def __init__(self, max_disappeared: int = 30, max_distance: float = 80.0):
        self.next_object_id = 1
        self.objects = {} # id -> bbox [x1, y1, x2, y2]
        self.disappeared = {} # id -> frames disappeared
        self.history = {} # id -> list of (center_x, center_y, timestamp)
        self.max_disappeared = max_disappeared
        self.max_distance = max_distance

    def update(self, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Update tracker with frame detections and assign persistent tracking IDs."""
        current_time = time.time()
        input_centroids = []
        for det in detections:
            bbox = det["bbox"]
            cx = (bbox[0] + bbox[2]) / 2.0
            cy = (bbox[1] + bbox[3]) / 2.0
            input_centroids.append((cx, cy, det))

        if len(self.objects) == 0:
            tracked_detections = []
            for cx, cy, det in input_centroids:
                obj_id = self.next_object_id
                self.next_object_id += 1
                self.objects[obj_id] = det["bbox"]
                self.disappeared[obj_id] = 0
                self.history[obj_id] = [(cx, cy, current_time)]
                
                det_copy = det.copy()
                det_copy["track_id"] = obj_id
                tracked_detections.append(det_copy)
            return tracked_detections

        # Match existing objects to current detections via Euclidean distance
        object_ids = list(self.objects.keys())
        object_centroids = []
        for obj_id in object_ids:
            bbox = self.objects[obj_id]
            object_centroids.append(((bbox[0] + bbox[2]) / 2.0, (bbox[1] + bbox[3]) / 2.0))

        matched_object_ids = set()
        matched_input_indices = set()
        tracked_detections = []

        for i, (icx, icy, det) in enumerate(input_centroids):
            best_dist = float("inf")
            best_obj_id = None
            for j, obj_id in enumerate(object_ids):
                if obj_id in matched_object_ids:
                    continue
                ocx, ocy = object_centroids[j]
                dist = math.hypot(icx - ocx, icy - ocy)
                if dist < best_dist and dist < self.max_distance:
                    best_dist = dist
                    best_obj_id = obj_id

            if best_obj_id is not None:
                matched_object_ids.add(best_obj_id)
                matched_input_indices.add(i)
                self.objects[best_obj_id] = det["bbox"]
                self.disappeared[best_obj_id] = 0
                self.history[best_obj_id].append((icx, icy, current_time))
                if len(self.history[best_obj_id]) > 20:
                    self.history[best_obj_id].pop(0)

                det_copy = det.copy()
                det_copy["track_id"] = best_obj_id
                tracked_detections.append(det_copy)

        # Register un-matched inputs as new objects
        for i, (icx, icy, det) in enumerate(input_centroids):
            if i not in matched_input_indices:
                obj_id = self.next_object_id
                self.next_object_id += 1
                self.objects[obj_id] = det["bbox"]
                self.disappeared[obj_id] = 0
                self.history[obj_id] = [(icx, icy, current_time)]

                det_copy = det.copy()
                det_copy["track_id"] = obj_id
                tracked_detections.append(det_copy)

        # Mark unmatched existing objects as disappeared
        for obj_id in object_ids:
            if obj_id not in matched_object_ids:
                self.disappeared[obj_id] += 1
                if self.disappeared[obj_id] > self.max_disappeared:
                    del self.objects[obj_id]
                    del self.disappeared[obj_id]
                    del self.history[obj_id]

        return tracked_detections

    def get_velocity_and_direction(self, track_id: int) -> Tuple[float, float, str]:
        """Compute pixel velocity (px/sec), speed km/h estimate, and heading direction."""
        if track_id not in self.history or len(self.history[track_id]) < 2:
            return 0.0, 0.0, "UNKNOWN"

        p_old = self.history[track_id][0]
        p_new = self.history[track_id][-1]
        dt = p_new[2] - p_old[2]
        if dt <= 0:
            return 0.0, 0.0, "UNKNOWN"

        dx = p_new[0] - p_old[0]
        dy = p_new[1] - p_old[1]
        distance_px = math.hypot(dx, dy)
        velocity_px_sec = distance_px / dt

        # Direction calculation
        angle_deg = math.degrees(math.atan2(dy, dx))
        if -45 <= angle_deg <= 45:
            direction = "RIGHT"
        elif 45 < angle_deg <= 135:
            direction = "DOWN"
        elif -135 <= angle_deg < -45:
            direction = "UP"
        else:
            direction = "LEFT"

        return velocity_px_sec, distance_px, direction

tracking_service = ByteTrackService()
