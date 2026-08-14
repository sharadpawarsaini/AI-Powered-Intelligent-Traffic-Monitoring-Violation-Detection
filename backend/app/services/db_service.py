import os
import json
import sqlite3
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
import motor.motor_asyncio
from app.config import settings

class UnifiedDatabaseService:
    def __init__(self):
        self.use_mongo = False
        self.client = None
        self.db = None
        self.sqlite_path = os.path.join(os.path.dirname(settings.BASE_DIR), settings.SQLITE_DB_PATH)
        
    async def initialize(self):
        """Try connecting to MongoDB; fall back to SQLite if unavailable."""
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=2000
            )
            # Test ping
            await self.client.admin.command('ping')
            self.db = self.client[settings.MONGODB_DB_NAME]
            self.use_mongo = True
            print(f"[DB] Connected successfully to MongoDB at {settings.MONGODB_URL}")
        except Exception as e:
            print(f"[DB] MongoDB unavailable ({e}). Initializing SQLite fallback engine at {self.sqlite_path}")
            self.use_mongo = False
            self._init_sqlite()

    def _init_sqlite(self):
        """Initialize SQLite tables for fallback database engine."""
        os.makedirs(os.path.dirname(self.sqlite_path), exist_ok=True)
        conn = sqlite3.connect(self.sqlite_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cameras (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                stream_url TEXT,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS vehicles (
                id TEXT PRIMARY KEY,
                tracking_id INTEGER NOT NULL,
                vehicle_type TEXT NOT NULL,
                plate_number TEXT,
                first_seen TEXT NOT NULL,
                last_seen TEXT NOT NULL,
                speed_kmh REAL DEFAULT 0.0
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS traffic_events (
                id TEXT PRIMARY KEY,
                event_type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                camera_id TEXT NOT NULL,
                location TEXT NOT NULL,
                vehicle_id TEXT,
                confidence REAL NOT NULL,
                severity TEXT NOT NULL,
                description TEXT,
                evidence_path TEXT,
                video_path TEXT,
                metadata TEXT,
                is_demo INTEGER DEFAULT 0
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS violations (
                id TEXT PRIMARY KEY,
                event_id TEXT NOT NULL,
                violation_type TEXT NOT NULL,
                vehicle_id TEXT,
                confidence REAL NOT NULL,
                timestamp TEXT NOT NULL,
                evidence_path TEXT,
                camera_location TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS accidents (
                id TEXT PRIMARY KEY,
                event_id TEXT NOT NULL,
                severity TEXT NOT NULL,
                confidence REAL NOT NULL,
                vehicle_ids TEXT,
                timestamp TEXT NOT NULL,
                evidence_path TEXT,
                location TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS traffic_statistics (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                total_vehicles_today INTEGER,
                current_active_vehicles INTEGER,
                vehicle_counts_by_class TEXT,
                average_speed_kmh REAL,
                total_violations_today INTEGER,
                total_accidents_today INTEGER,
                traffic_density_level TEXT
            )
        """)
        
        conn.commit()
        conn.close()

    # --- USER OPERATIONS ---
    async def create_user(self, user_dict: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in user_dict:
            user_dict["id"] = str(uuid.uuid4())
        if "created_at" not in user_dict:
            user_dict["created_at"] = datetime.utcnow().isoformat()
            
        if self.use_mongo:
            await self.db.users.insert_one(user_dict)
            return user_dict
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (user_dict["id"], user_dict["name"], user_dict["email"], user_dict["password_hash"], user_dict["role"], str(user_dict["created_at"]))
            )
            conn.commit()
            conn.close()
            return user_dict

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            user = await self.db.users.find_one({"email": email})
            if user:
                user["_id"] = str(user["_id"])
            return user
        else:
            conn = sqlite3.connect(self.sqlite_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return dict(row)
            return None

    # --- CAMERA OPERATIONS ---
    async def get_cameras(self) -> List[Dict[str, Any]]:
        if self.use_mongo:
            cursor = self.db.cameras.find({})
            cameras = await cursor.to_list(length=100)
            for c in cameras:
                c["_id"] = str(c.get("_id", c.get("id")))
            return cameras
        else:
            conn = sqlite3.connect(self.sqlite_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cameras ORDER BY created_at DESC")
            rows = cursor.fetchall()
            conn.close()
            return [dict(r) for r in rows]

    async def create_camera(self, camera_dict: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in camera_dict:
            camera_dict["id"] = str(uuid.uuid4())
        if "created_at" not in camera_dict:
            camera_dict["created_at"] = datetime.utcnow().isoformat()
            
        if self.use_mongo:
            await self.db.cameras.insert_one(camera_dict)
            return camera_dict
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO cameras (id, name, location, stream_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (camera_dict["id"], camera_dict["name"], camera_dict["location"], camera_dict.get("stream_url", ""), camera_dict["status"], str(camera_dict["created_at"]))
            )
            conn.commit()
            conn.close()
            return camera_dict

    # --- TRAFFIC EVENTS & VIOLATIONS & ACCIDENTS ---
    async def create_event(self, event_dict: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in event_dict:
            event_dict["id"] = str(uuid.uuid4())
        if isinstance(event_dict.get("timestamp"), datetime):
            event_dict["timestamp"] = event_dict["timestamp"].isoformat()
            
        if self.use_mongo:
            await self.db.traffic_events.insert_one(event_dict)
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO traffic_events 
                (id, event_type, timestamp, camera_id, location, vehicle_id, confidence, severity, description, evidence_path, video_path, metadata, is_demo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    event_dict["id"], event_dict["event_type"], str(event_dict["timestamp"]),
                    event_dict["camera_id"], event_dict["location"], event_dict.get("vehicle_id"),
                    float(event_dict["confidence"]), event_dict["severity"], event_dict["description"],
                    event_dict.get("evidence_path"), event_dict.get("video_path"),
                    json.dumps(event_dict.get("metadata", {})), 1 if event_dict.get("is_demo") else 0
                )
            )
            conn.commit()
            conn.close()
        return event_dict

    async def get_events(self, limit: int = 100, event_type: Optional[str] = None, severity: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.use_mongo:
            query = {}
            if event_type: query["event_type"] = event_type
            if severity: query["severity"] = severity
            cursor = self.db.traffic_events.find(query).sort("timestamp", -1).limit(limit)
            events = await cursor.to_list(length=limit)
            for e in events:
                if "_id" in e: e["_id"] = str(e["_id"])
            return events
        else:
            conn = sqlite3.connect(self.sqlite_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            sql = "SELECT * FROM traffic_events WHERE 1=1"
            params = []
            if event_type:
                sql += " AND event_type = ?"
                params.append(event_type)
            if severity:
                sql += " AND severity = ?"
                params.append(severity)
            sql += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)
            cursor.execute(sql, tuple(params))
            rows = cursor.fetchall()
            conn.close()
            res = []
            for r in rows:
                d = dict(r)
                if d.get("metadata"):
                    try: d["metadata"] = json.loads(d["metadata"])
                    except: pass
                res.append(d)
            return res

    async def create_violation(self, violation_dict: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in violation_dict:
            violation_dict["id"] = str(uuid.uuid4())
        if isinstance(violation_dict.get("timestamp"), datetime):
            violation_dict["timestamp"] = violation_dict["timestamp"].isoformat()

        if self.use_mongo:
            await self.db.violations.insert_one(violation_dict)
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO violations (id, event_id, violation_type, vehicle_id, confidence, timestamp, evidence_path, camera_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (violation_dict["id"], violation_dict["event_id"], violation_dict["violation_type"], violation_dict.get("vehicle_id"), float(violation_dict["confidence"]), str(violation_dict["timestamp"]), violation_dict.get("evidence_path"), violation_dict.get("camera_location"))
            )
            conn.commit()
            conn.close()
        return violation_dict

    async def get_violations(self, limit: int = 100) -> List[Dict[str, Any]]:
        if self.use_mongo:
            cursor = self.db.violations.find({}).sort("timestamp", -1).limit(limit)
            violations = await cursor.to_list(length=limit)
            for v in violations:
                if "_id" in v: v["_id"] = str(v["_id"])
            return violations
        else:
            conn = sqlite3.connect(self.sqlite_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM violations ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            conn.close()
            return [dict(r) for r in rows]

    async def create_accident(self, accident_dict: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in accident_dict:
            accident_dict["id"] = str(uuid.uuid4())
        if isinstance(accident_dict.get("timestamp"), datetime):
            accident_dict["timestamp"] = accident_dict["timestamp"].isoformat()

        if self.use_mongo:
            await self.db.accidents.insert_one(accident_dict)
        else:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO accidents (id, event_id, severity, confidence, vehicle_ids, timestamp, evidence_path, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (accident_dict["id"], accident_dict["event_id"], accident_dict["severity"], float(accident_dict["confidence"]), json.dumps(accident_dict.get("vehicle_ids", [])), str(accident_dict["timestamp"]), accident_dict.get("evidence_path"), accident_dict.get("location"))
            )
            conn.commit()
            conn.close()
        return accident_dict

    async def get_accidents(self, limit: int = 100) -> List[Dict[str, Any]]:
        if self.use_mongo:
            cursor = self.db.accidents.find({}).sort("timestamp", -1).limit(limit)
            accidents = await cursor.to_list(length=limit)
            for a in accidents:
                if "_id" in a: a["_id"] = str(a["_id"])
            return accidents
        else:
            conn = sqlite3.connect(self.sqlite_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM accidents ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            conn.close()
            res = []
            for r in rows:
                d = dict(r)
                if d.get("vehicle_ids"):
                    try: d["vehicle_ids"] = json.loads(d["vehicle_ids"])
                    except: pass
                res.append(d)
            return res

db_service = UnifiedDatabaseService()
