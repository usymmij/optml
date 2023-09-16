import tensorflow as tf
import numpy as np
import json

# types of layers available; these two should correspond by index
LAYER_TYPE_CODES = ["data-input", "dense"]
LAYER_TYPES = [tf.keras.layers.Input, tf.keras.layers.Dense]

LAYER_ARG_TYPES = {
    "shape": "tuple", 
    "units": "int", 
    "activation": "str"
}

class KerasGen:
    def __init__(self, model_arch):
        self.arch = model_arch
        self.layers = []
        pass

    ## translate json into keras layers objects, and adds them to self.layers
    def translate_layers(self):
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
        for layer in layers:
            layer_order.append(layer["id"])
            if layer["type"] == "data-input":
                inputId = layer["id"]
        

        # i remember there being a better way to do this but i cant bother rn
        new_order = [inputId]
        nextEdge = self.__findEdge(edges, new_order[-1])
        while nextEdge != None:
            new_order.append(nextEdge)
            nextEdge = self.__findEdge(edges, new_order[-1])
        print(new_order)
        print(layer_order)
        exit()
        return 0
    
    def __findEdge(self, edges, layerid):
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
    
# args = { "inputs": 20 }
    def __getLayerArgs(self, layer_type_name, layer_arg_vals):
        match layer_type_name:
            case "data-input":
                args = self.layerArgsEncoder(layer_arg_vals, ["shape"])
            case "dense":
                args = self.layerArgsEncoder(layer_arg_vals, ["units", "activation"])
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