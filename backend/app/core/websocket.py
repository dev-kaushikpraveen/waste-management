from typing import List, Dict, Any
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Store active connections
        self.active_connections: List[WebSocket] = []
        # Topic/channel-based subscribers
        self.subscribers: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str = "global"):
        await websocket.accept()
        self.active_connections.append(websocket)
        if channel not in self.subscribers:
            self.subscribers[channel] = []
        self.subscribers[channel].append(websocket)
        logger.info(f"WebSocket client connected to {channel}. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket, channel: str = "global"):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if channel in self.subscribers and websocket in self.subscribers[channel]:
            self.subscribers[channel].remove(websocket)
        logger.info(f"WebSocket client disconnected from {channel}")

    async def broadcast(self, message: Dict[str, Any], channel: str = "global"):
        payload = json.dumps(message)
        dead_sockets = []
        targets = self.subscribers.get(channel, self.active_connections)
        for connection in targets:
            try:
                await connection.send_text(payload)
            except Exception:
                dead_sockets.append(connection)
        for dead in dead_sockets:
            self.disconnect(dead, channel)

ws_manager = ConnectionManager()
