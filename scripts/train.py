import os
import sys

def train_yolo_model(dataset_yaml="data/datasets/traffic_dataset.yaml", epochs=50, imgsz=640):
    print(f"[Training Pipeline] Starting YOLO Model Training...")
    print(f"  • Dataset config : {dataset_yaml}")
    print(f"  • Epochs         : {epochs}")
    print(f"  • Image Size     : {imgsz}")
    
    try:
        from ultralytics import YOLO
        model = YOLO("yolov8n.pt")
        if os.path.exists(dataset_yaml):
            model.train(data=dataset_yaml, epochs=epochs, imgsz=imgsz)
            print("[Training Pipeline] Training completed. Model exported to runs/detect/train/weights/best.pt")
        else:
            print(f"[Training Pipeline Note] Dataset YAML '{dataset_yaml}' not found. Provide annotated traffic dataset YAML to initiate custom training.")
    except Exception as e:
        print(f"[Training Pipeline Error] {e}")

if __name__ == "__main__":
    train_yolo_model()
