import tensorflow as tf
import numpy as np
import json

LAYER_TYPE_CODES = ["data-input"]
LAYER_TYPES = [tf.keras.layers.Input]

class KerasGen:
    def __init__(self, model_arch):
        self.arch = model_arch
        self.layers = []
        pass

    def translate_layers(self):
        # converts json to py dict
        raw = json.loads(self.arch)
        raw_layers = raw["nodes"]


        for layer in raw_layers:
            self.layers.append(self.getLayer(layer))
        
    def getLayerArgs(self, id):
        pass


    def getLayer(self, layer):
        layertype = layer["type"]
        args = layer["data"][""]

        try:
            layerid = LAYER_TYPE_CODES.index(layertype)
        
        except:
            print("Error: Invalid layer code")
            exit

        layer_type = LAYER_TYPES[layerid]
        self.getLayerArgs(layerid)
        pass