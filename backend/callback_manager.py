import keras
from database import Database
from connection_manager import ConnectionManager

class CallbackManager(keras.callbacks.Callback):
    def __init__(self, model_id: str, database: Database, manager: ConnectionManager):
        self.model_id = model_id
        self.database = database
        self.manager = manager

    def on_train_begin(self, logs=None):
        keys = list(logs.keys())
        print("Starting training; got log keys: {}".format(keys))

    def on_train_end(self, logs=None):
        keys = list(logs.keys())
        print("Stop training; got log keys: {}".format(keys))

    def on_epoch_begin(self, epoch, logs=None):
        keys = list(logs.keys())
        print("Start epoch {} of training; got log keys: {}".format(epoch, keys))

    def on_epoch_end(self, epoch, logs=None):
        keys = list(logs.keys())
        print("End epoch {} of training; got log keys: {}".format(epoch, keys))
