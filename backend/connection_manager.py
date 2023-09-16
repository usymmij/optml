from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, model_id: str):
        await websocket.accept()
        if model_id in self.active_connections:
            self.active_connections[model_id].append(websocket)
        else:
            self.active_connections[model_id] = [websocket]

    def disconnect(self, websocket: WebSocket, model_id: str):
        self.active_connections[model_id].remove(websocket)
        if len(self.active_connections[model_id]) == 0:
            del self.active_connections[model_id]

    async def send_model_json(self, model_id: str, data: dict):
        if model_id in self.active_connections:
            for connection in self.active_connections.get(model_id):
                await connection.send_json(data)

    async def broadcast(self, message: str):
        for model_id in self.active_connections:
            for connection in self.active_connections.get(model_id):
                await connection.send_text(message)