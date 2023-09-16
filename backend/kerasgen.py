import tensorflow as tf
import numpy as np
from tensorflow import keras 
import json

# types of layers available; these two should correspond by index
LAYER_TYPE_CODES = ["data-input", "dense", "normalization", 
                    "batch-normalization", "conv1d", "conv2d", 
                    "conv3d", "flatten", "dropout"]
LAYER_TYPES = [ keras.Input, keras.layers.Dense, keras.layers.Normalization,
               keras.layers.BatchNormalization, keras.layers.Conv1D, keras.layers.Conv2D, 
               keras.layers.Conv3D, keras.layers.Flatten, keras.layers.Dropout]

LAYER_ARG_TYPES = {
    "shape": "tuple", 
    "units": "int", 
    "activation": "str",
    "filters": "tuple",
    "kernel-size": "int",
    "strides": "int",
    "padding": "str",
    "rate": "float"
}

OPTIMIZERS = {
    'rmsprop',
    'adam',
    'sgd'
}

class KerasGen:
    def __init__(self, model_arch):
        self.arch = model_arch
        self.layers = []
        self.model = None
        self.optimizer = 'rmsprop'
        self.status = 'build'
        pass

    def compile_model(self, model=None, optimizer=None):
        # if no model is given, use the 
        if model == None:
            self.status = 'compiled'
            if self.status == 'build':
                self.generate_model()
            model = self.model
        if not optimizer in OPTIMIZERS:
            optimizer = self.optimizer
        model.compile(optimizer)
        return model

    def generate_model(self):
        self.status = 'generated'
        self.model = keras.Sequential()
        for layer in self.layers:
            self.model.add(layer)
        return self.model

    ## translate json into keras layers objects, and adds them to self.layers
    def translate_layers(self):
        self.status = 'build'
        # converts json to py dict
        raw = json.loads(self.arch)

        # get the layers dict
        raw_layers = raw["nodes"]

        # sort the layers properly
        raw_layers = self.__orderLayers(raw_layers, raw["edges"])

        # convert each JSON defined layer into keras layer object and add to the list
        for layer in raw_layers:
            self.layers.append(self.__getLayer(layer))
        print(self.layers)

    def __orderLayers(self, layers, edges):
        inputId = -1
        layer_order = []
        ordered_layers = []
        for layer in layers:
            layer_order.append(layer["id"])
            if layer["type"] == "data-input":
                inputId = layer["id"]
        
        if inputId == -1:
            print("Error (kerasgen.py): no input layer")
            exit()

        # i remember there being a better way to do this but i cant bother rn
        new_order = [inputId]
        nextLayer = self.__findEdgeTarg(edges, new_order[-1])
        while nextLayer != None:
            new_order.append(nextLayer)
            nextLayer = self.__findEdgeTarg(edges, new_order[-1])
    
        for layerid in new_order:
            ordered_layers.append(layers[layer_order.index(layerid)])
        return ordered_layers
    
    def __findEdgeTarg(self, edges, layerid):
        for edge in edges:
            if edge["source"] == layerid:
                return edge["target"]
        return None

    # get create keras layer from JSON definition
    def __getLayer(self, layer):
        layer_type_name = layer["type"]
        args = layer["data"]

        try:
            layerid = LAYER_TYPE_CODES.index(layer_type_name)

        except:
            print("Error (kerasgen.py): Invalid layer type code")
            exit

        layer_type = LAYER_TYPES[layerid]
        args = self.__getLayerArgs(layer_type_name, args)
        return layer_type(**args)
    
    def __getLayerArgs(self, layer_type_name, layer_arg_vals):
        match layer_type_name:
            case "data-input":
                args = self.layerArgsEncoder(layer_arg_vals, ["shape"])
            case "dense":
                args = self.layerArgsEncoder(layer_arg_vals, ["units", "activation"])
            case "normalization":
                args = self.layerArgsEncoder(layer_arg_vals, [])
            case "batch-normalization":
                args = self.layerArgsEncoder(layer_arg_vals, [])
            case "conv1d":    
                args = self.layerArgsEncoder(layer_arg_vals, ["filters", "kernel-size", "strides", "padding"])
            case "conv2d":    
                args = self.layerArgsEncoder(layer_arg_vals, ["filters", "kernel-size", "strides", "padding"])
            case "conv3d":    
                args = self.layerArgsEncoder(layer_arg_vals, ["filters", "kernel-size", "strides", "padding"])
            case "flatten":    
                args = self.layerArgsEncoder(layer_arg_vals, [])
            case "dropout":    
                args = self.layerArgsEncoder(layer_arg_vals, ["rate"])
        return args

# encodes which keras args are needed for a layer type into a dict
    def layerArgsEncoder(self, values, args):
        return_args = {}
        for arg in args:
            # check that argument is valid
            # should check that types match too (in getData()) in the future
            if arg in LAYER_ARG_TYPES:
                return_args[arg] = self.__getData(values[arg], LAYER_ARG_TYPES[arg])
        return return_args

    def __getData(self, value, type):
        match type:
            case "tuple":
                return tuple(value)
            case "int":
                return int(value)
            case "str":
                return str(value)
            case _:
                print("Error (kerasgen.py): Invalid layer argument type")
                
    def get_args(self):
        return self.return_args

# test        
if __name__=="__main__":
    f = open("./test.json")
    gen = KerasGen(f.read())
    gen.translate_layers()
    gen.generate_model()
    m=gen.compile_model()
    print(m.optimizer)