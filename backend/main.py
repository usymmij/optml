import asyncio
from time import sleep
from fastapi import BackgroundTasks, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4, UUID
from database import Database
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        if client_id in self.active_connections:
            self.active_connections[client_id].append(websocket)
        else:
            self.active_connections[client_id] = [websocket]

    def disconnect(self, websocket: WebSocket, client_id: str):
        self.active_connections[client_id].remove(websocket)
        if len(self.active_connections[client_id]) == 0:
            del self.active_connections[client_id]

    async def send_model_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            for connection in self.active_connections.get(client_id):
                await connection.send_text(message)

    async def send_personal_json(self, client_id: str, data: dict):
        if client_id in self.active_connections:
            for connection in self.active_connections.get(client_id):
                await connection.send_json(data)

    async def broadcast(self, message: str):
        for client_id in self.active_connections:
            for connection in self.active_connections.get(client_id):
                await connection.send_text(message)

manager = ConnectionManager()
db = Database()

async def dummy_progress(id: UUID):
    for i in range(10):
        if manager.active_connections.get(str(id)):
            await manager.send_personal_json(str(id), {"progress": i})
        await asyncio.sleep(1)
    await manager.send_personal_json(str(id), {"progress": 0})

@app.post("/upload")
async def upload_flow_schema(data: dict, background_tasks: BackgroundTasks):
    if data:
        id = uuid4()
        background_tasks.add_task(dummy_progress, id)
        return id

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        await manager.send_model_message(f"Welcome client #{client_id}", client_id)
        while True:
            data = await websocket.receive_text()
            print(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
        await manager.broadcast(f"Client #{client_id} left the chat")

@app.post("/create")
async def createModel():
    await db.addModel()
    return

@app.get("/models/{model_id}")
async def retrieve_model(model_id):
    model = await db.findModel(model_id)
    return model.json