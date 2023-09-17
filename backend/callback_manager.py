import asyncio
import keras
from database import Database
from connection_manager import ConnectionManager


class CallbackManager(keras.callbacks.Callback):
    def __init__(self, model_id: str, run_id: str, database: Database, manager: ConnectionManager):
        self.model_id = model_id
        self.run_id = run_id
        self.database = database
        self.manager = manager

    def on_epoch_end(self, epoch, logs=None):
        keys = list(logs.keys())

        if 'accuracy' in keys and 'loss' in keys:
            asyncio.create_task(self.database.new_stats(
                self.model_id, self.run_id, epoch, logs['accuracy'], logs['loss']))
            # asyncio.create_task(self.manager.send_model_json(self.model_id, {
            #     'epoch': epoch,
            #     'accuracy': logs['accuracy'],
            #     'loss': logs['loss']
            # }))
