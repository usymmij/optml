from typing import Annotated
from fastapi import BackgroundTasks, FastAPI, UploadFile, WebSocket, WebSocketDisconnect, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from connection_manager import ConnectionManager
from database import Database
from kerasgen import KerasGen
import numpy as np

manager = ConnectionManager()
db = Database()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.connect()


@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()


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
    model = await db.create_model()
    return model.id


@app.post("/update/{model_id}")
async def update_model(model_id: str, model_data: dict):
    try:
        await db.update_model(model_id, model_data)
    except:
        raise HTTPException(status_code=404, detail="Model not found")
    return model_id


@app.get("/model/{model_id}")
async def retrieve_model(model_id):
    try:
        model = await db.find_model(model_id)
        return model.flow_data
    except:
        raise HTTPException(status_code=404, detail="Model not found")
#    
#
#def train(model, training_data):
#    trainx = np.load(training_data)["trainx"]
#    trainy = np.load(training_data)["trainy"]
#    testx = np.load(training_data)["testx"]
#    testy = np.load(training_data)["testy"]
#    model.train(trainx, trainy, batch_size=10, epochs=10)
    

@app.post("/train/{model_id}")
async def train_model(model_id: str, optimizer: Annotated[str, Form()], training_data: UploadFile, background_tasks: BackgroundTasks):
    print("Compiling model...")
    model = await db.find_model(model_id)

    # build and generate
    keras_model = KerasGen(model.flow_data)
    # add hyperparams here
    keras_model.translate_and_compile()

    background_tasks.add_task(keras_model.training, training_data.file)

    return model.id
