# AI-Powered Intelligent Traffic Monitoring, Violation Detection, Accident Detection & GenAI Platform

A modular, production-style academic major project platform integrating **Computer Vision**, **Multi-Object Tracking**, **Traffic Analytics**, **Traffic Violation Detection**, **Potential Accident Detection**, **Number Plate Recognition**, **MongoDB / Unified Database Storage**, **REST API Backend**, **Dark AI React Dashboard**, and a **GenAI / RAG Natural Language Traffic Assistant**.

---

## 🌟 Key System Features

* **Computer Vision & Deep Learning**: Real-time object detection (YOLOv8/v11) for vehicles (Cars, Motorcycles, Buses, Trucks, Bicycles) and Pedestrians with CUDA GPU acceleration auto-detection.
* **Multi-Object Tracking**: ByteTrack persistent tracking assigning persistent IDs across video frames with spatial movement vector estimation.
* **Traffic Analytics**: Vehicle flow rate, class distribution, hourly volume charts, and calibrated speed estimation ($\text{km/h}$).
* **Traffic Violation Detection Engine**:
  - **No-Helmet Detection**: Crop rider bounding regions to check helmet presence.
  - **Wrong-Way Driving**: Compute trajectory angle against permitted travel direction vectors.
  - **Red-Light Violation**: Detect stop line crossing during red signal states.
  - **Illegal Parking**: Stationary vehicle detection inside restricted zones for > 10s.
  - **Triple Riding**: Detect motorcycles carrying 3+ overlapping rider bounding boxes.
* **Potential Accident Detection Engine**: Multi-signal temporal collision scoring:
  $$\text{Accident Score} = (S_{\text{collision}} \times 0.40) + (S_{\text{velocity\_change}} \times 0.35) + (S_{\text{trajectory\_change}} \times 0.25)$$
* **License Plate OCR**: Vehicle plate cropping, OCR extraction, regex pattern validation, and evidence snapshot storage.
* **Database & Dual Engine**: Native MongoDB integration (Motor driver) with automatic local SQLite fallback for offline demo environments.
* **GenAI / RAG Traffic Assistant**: Natural language querying over structured traffic event database and vector store document embeddings (`all-MiniLM-L6-v2` + Ollama/Local LLM).
* **Dark AI Dashboard**: High-impact React + Vite + Tailwind CSS dashboard with real-time video stream overlay, interactive charts, event filters, and CSV report export.

---

## 🏗️ System Architecture

```text
                  ┌──────────────────────┐
                  │ CCTV / Webcam / Video│
                  │ Image Upload         │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Video Preprocessing  │
                  │ Frame Extraction     │
                  │ Resize / Normalize   │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ YOLO Object Detector │
                  │ Vehicle / Pedestrian │
                  │ Detection            │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Multi Object Tracker │
                  │ ByteTrack / DeepSORT │
                  └──────────┬───────────┘
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
      Traffic Analytics   Violation       Accident
                          Detection        Detection
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                  ┌──────────────────────┐
                  │ Number Plate OCR     │
                  │ Vehicle Information  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Event Processing     │
                  │ Severity Calculation │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ MongoDB / SQLite DB  │
                  │ Event Storage        │
                  └──────────┬───────────┘
                             │
             ┌───────────────┴────────────────┐
             ▼                                ▼
    ┌──────────────────┐             ┌──────────────────┐
    │ Analytics        │             │ RAG Pipeline     │
    │ Dashboard        │             │ Retrieval        │
    └──────────────────┘             └────────┬─────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ LLM / GenAI      │
                                    │ Traffic Assistant│
                                    └──────────────────┘
```

---

## ⚡ Quick Start & Installation

### 1. Backend Setup

```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# Install dependencies:
pip install -r requirements.txt

# Seed Database with DEMO DATA:
python ../scripts/seed_data.py

# Run FastAPI Backend Server:
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open browser at `http://localhost:5173`.
Default Login Credentials:
- **Email**: `admin@traffic.ai`
- **Password**: `admin123`

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

---

## 📄 License & Academic Attribution
Created as a major academic project for AI-Powered Intelligent Traffic Monitoring, Violation Detection, Accident Detection & GenAI/RAG.
