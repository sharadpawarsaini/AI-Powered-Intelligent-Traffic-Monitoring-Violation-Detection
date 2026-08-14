import time
from typing import Dict, Any, List

class AlertNotificationService:
    def __init__(self):
        self.alert_history = []
        self.cooldowns = {}
        self.cooldown_seconds = 10.0

    def trigger_alert(self, title: str, message: str, severity: str, metadata: Dict[str, Any] = None) -> bool:
        current_time = time.time()
        key = f"{title}:{severity}"

        if key in self.cooldowns and (current_time - self.cooldowns[key]) < self.cooldown_seconds:
            return False

        self.cooldowns[key] = current_time
        alert_item = {
            "id": len(self.alert_history) + 1,
            "title": title,
            "message": message,
            "severity": severity,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "metadata": metadata or {}
        }
        self.alert_history.insert(0, alert_item)
        if len(self.alert_history) > 100:
            self.alert_history.pop()

        print(f"[ALERT - {severity.upper()}] {title}: {message}")
        return True

    def get_recent_alerts(self, limit: int = 20) -> List[Dict[str, Any]]:
        return self.alert_history[:limit]

alert_service = AlertNotificationService()
