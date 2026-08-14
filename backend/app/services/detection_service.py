import os
import cv2
import numpy as np
import torch
from typing import List, Dict, Any, Tuple
from app.config import settings

class YOLODetectionService:
    def __init__(self):
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[CV Engine] Initializing YOLO Detector on Device: {self.device.upper()}")
        self.target_classes = {
            2: "car",
            3: "motorcycle",
            5: "bus",
            7: "truck",
            1: "bicycle",
            0: "person"
        }
        self.load_model()

    def load_model(self):
        try:
            from ultralytics import YOLO
            # Load standard pretrained YOLO model
            model_name = settings.YOLO_MODEL_PATH if os.path.exists(settings.YOLO_MODEL_PATH) else "yolov8n.pt"
            self.model = YOLO(model_name)
            self.model.to(self.device)
            print(f"[CV Engine] YOLO Model '{model_name}' loaded successfully on {self.device.upper()}")
        except Exception as e:
            print(f"[CV Engine] Error loading YOLO model: {e}. Running in simulation mode.")

    def detect_frame(self, frame: np.ndarray, conf_threshold: float = None) -> List[Dict[str, Any]]:
        if conf_threshold is None:
            conf_threshold = settings.CONFIDENCE_THRESHOLD

        if self.model is None or frame is None:
            return []

        try:
            results = self.model.predict(
                frame,
                conf=conf_threshold,
                iou=settings.IOU_THRESHOLD,
                verbose=False,
                device=self.device
            )

            detections = []
            for r in results:
                boxes = r.boxes
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    if cls_id in self.target_classes:
                        conf = float(box.conf[0].item())
                        xyxy = box.xyxy[0].cpu().numpy().tolist()
                        detections.append({
                            "class_id": cls_id,
                            "class_name": self.target_classes[cls_id],
                            "confidence": round(conf, 4),
                            "bbox": [round(coord, 2) for coord in xyxy] # [x1, y1, x2, y2]
                        })
            return detections
        except Exception as e:
            print(f"[CV Engine] Detection Error: {e}")
            return []

detection_service = YOLODetectionService()
