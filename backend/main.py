from typing import Annotated
from uuid import uuid4
from fastapi import BackgroundTasks, FastAPI, UploadFile, WebSocket, WebSocketDisconnect, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from callback_manager import CallbackManager
from connection_manager import ConnectionManager
from database import Database
from kerasgen import KerasGen

manager = ConnectionManager()
db = Database()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://optml.tech", "https://www.optml.tech"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    db.connect()


@app.on_event("shutdown")
async def shutdown():
    db.disconnect()


@app.websocket("/ws/{model_id}")
async def websocket_endpoint(websocket: WebSocket, model_id: str):
    await manager.connect(websocket, model_id)
    try:
        await manager.send_model_json(model_id, {
            'message': f"Welcome client #{model_id}"
        })
        while True:
            data = await websocket.receive_text()
            print(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, model_id)
        await manager.broadcast(f"Client #{model_id} left the chat")


@app.post("/create")
async def create_model():
    model = db.create_model()
    return model.id


@app.post("/update/{model_id}")
async def update_model(model_id: str, model_data: dict):
    try:
        db.update_model(model_id, model_data)
    except:
        raise HTTPException(status_code=404, detail="Model not found")
    return model_id


@app.get("/model/{model_id}")
async def retrieve_model(model_id):
    try:
        model = db.find_model(model_id)
        return model.flow_data
    except:
        raise HTTPException(status_code=404, detail="Model not found")


@app.get("/model/{model_id}/stats")
async def retrieve_model_stats(model_id, run_id: str):
    try:
        return db.get_stats(model_id, run_id)
    except:
        raise HTTPException(status_code=404, detail="Model not found")


@app.post("/train/{model_id}")
async def train_model(model_id: str, optimizer: Annotated[str, Form()], epochs: Annotated[str, Form()], batch_size: Annotated[str, Form()], training_data: UploadFile, background_tasks: BackgroundTasks, loss: Annotated[str, Form()]):
    print("Compiling model...")
    num_epochs = int(epochs) if epochs else 1
    num_batch_size = int(batch_size) if batch_size else 1
    model = await db.find_model(model_id)

    # build and generate
    run_id = str(uuid4())
    callback_manager = CallbackManager(model_id, run_id, db, manager)
    keras_model = KerasGen(model.flow_data, callback_manager)
    keras_model.set_hyperparams(optimizer, num_batch_size, num_epochs, loss)
    keras_model.translate_and_compile()

    background_tasks.add_task(keras_model.training, training_data.file)

    return run_id
