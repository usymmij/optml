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

# Argument types for layer params: dict for noting conversion from json, also for type checking
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

# available optimizers
# adding new ones should be as easy as adding the string with the exception of custom optimizers/ hyperparams
# only using default hyperparams for now
OPTIMIZERS = {
    'rmsprop',
    'adam',
    'sgd'
}

# Keras model generation class
class KerasGen:
    def __init__(self, model_arch):
        self.arch = model_arch
        self.layers = []
        self.model = None
        self.optimizer = 'rmsprop'
        self.status = 'build'
        pass

    # set the optimizer
    # other hyperparams should also be set here in the future
    def set_optimizer(self, optimizer):
        if optimizer in OPTIMIZERS:
            self.optimizer = optimizer

    def translate_and_compile(self):
        self.translate_layers()
        self.generate_model()
        self.compile_model()
        return self.model

    # apply hyperparams
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

    # assemble a keras model from list of layers 
    def generate_model(self):
        self.status = 'generated'
        self.model = keras.Sequential()
        for layer in self.layers:
            self.model.add(layer)
        return self.model

    # translate json into keras layers objects, and adds them to self.layers
    def translate_layers(self):
        self.status = 'build'
        # converts json to py dict
        raw = self.arch

        # get the layers dict
        raw_layers = raw["nodes"]

        # sort the layers properly
        raw_layers = self.__orderLayers(raw_layers, raw["edges"])

        # convert each JSON defined layer into keras layer object and add to the list
        for layer in raw_layers:
            self.layers.append(self.__getLayer(layer))
        print(self.layers)

    # order the layers based on the edges and input layer
    def __orderLayers(self, layers, edges):
        inputId = -1
        layer_order = []
        ordered_layers = []
        for layer in layers:
            layer_order.append(layer["id"])
            if layer["type"] == "data-input":
                inputId = layer["id"]

        # there needs to be at least one input layer
        if inputId == -1:
            print("Error (kerasgen.py): no input layer")
            return None

        # figure out the true order of the layers from edge source - target links
        # i think theres a better way to do this but i cant bother rn
        new_order = [inputId]
        nextLayer = self.__findEdgeTarg(edges, new_order[-1])
        while nextLayer != None:
            new_order.append(nextLayer)
            nextLayer = self.__findEdgeTarg(edges, new_order[-1])
    
        # assemble the layers together in the proper order
        for layerid in new_order:
            ordered_layers.append(layers[layer_order.index(layerid)])
        return ordered_layers
    
    # find next layer from a previous layer: find the edge with the prev layer as source, and return the target layer id
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
            print(layer_type_name)
            print("Error (kerasgen.py): Invalid layer type code")
            return None

        layer_type = LAYER_TYPES[layerid]
        args = self.__getLayerArgs(layer_type_name, args)
        return layer_type(**args)
    
    # get the required layer params from layer type name
    def __getLayerArgs(self, layer_type_name, layer_arg_vals):
        match layer_type_name:
            case "data-input":
                args = self.__layerArgsEncoder(layer_arg_vals, ["shape"])
            case "dense":
                args = self.__layerArgsEncoder(layer_arg_vals, ["units", "activation"])
            case "normalization":
                args = self.__layerArgsEncoder(layer_arg_vals, [])
            case "batch-normalization":
                args = self.__layerArgsEncoder(layer_arg_vals, [])
            case "conv1d":    
                args = self.__layerArgsEncoder(layer_arg_vals, ["filters", "kernel-size", "strides", "padding"])
            case "conv2d":    
                args = self.__layerArgsEncoder(layer_arg_vals, ["filters", "kernel-size", "strides", "padding"])
            case "conv3d":    
                args = self.__layerArgsEncoder(layer_arg_vals, ["filters", "kernel-size", "strides", "padding"])
            case "flatten":    
                args = self.__layerArgsEncoder(layer_arg_vals, [])
            case "dropout":    
                args = self.__layerArgsEncoder(layer_arg_vals, ["rate"])
        return args

# encodes which keras args are needed for a layer type into a dict
    def __layerArgsEncoder(self, values, args):
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