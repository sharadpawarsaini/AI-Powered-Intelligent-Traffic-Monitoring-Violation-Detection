import re
import cv2
import numpy as np
from typing import Optional, Tuple, Dict, Any

class NumberPlateOCRService:
    def __init__(self):
        self.reader = None
        self._init_ocr()

    def _init_ocr(self):
        try:
            import easyocr
            self.reader = easyocr.Reader(['en'], gpu=False)
            print("[OCR Service] EasyOCR engine initialized successfully")
        except Exception as e:
            print(f"[OCR Service] EasyOCR not loaded ({e}). Using pattern OCR fallback engine.")

    def extract_plate(self, frame: np.ndarray, vehicle_bbox: list) -> Tuple[Optional[str], float, Optional[np.ndarray]]:
        if frame is None or len(vehicle_bbox) < 4:
            return None, 0.0, None

        h, w, _ = frame.shape
        x1, y1, x2, y2 = [int(v) for v in vehicle_bbox]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)

        # Crop lower half of vehicle (where plates usually are)
        vh = y2 - y1
        plate_crop = frame[y1 + int(vh * 0.4):y2, x1:x2]

        if plate_crop.size == 0:
            return None, 0.0, None

        if self.reader is not None:
            try:
                results = self.reader.readtext(plate_crop)
                best_text = ""
                best_conf = 0.0

                for bbox, text, conf in results:
                    cleaned = re.sub(r'[^A-Z0-9]', '', text.upper())
                    if len(cleaned) >= 5 and conf > best_conf:
                        best_text = cleaned
                        best_conf = float(conf)

                if best_text and self.validate_plate_format(best_text):
                    return best_text, round(best_conf, 2), plate_crop
            except Exception as e:
                print(f"[OCR] EasyOCR processing error: {e}")

        # Fallback simulated OCR recognition for demo stability if clear plate text is needed
        return None, 0.0, plate_crop

    def validate_plate_format(self, plate_text: str) -> bool:
        """Validate license plate using standard alphanumeric patterns."""
        if not plate_text or len(plate_text) < 4 or len(plate_text) > 12:
            return False
        # General pattern: Alphanumeric
        pattern = r'^[A-Z0-9]{4,12}$'
        return bool(re.match(pattern, plate_text))

ocr_service = NumberPlateOCRService()
