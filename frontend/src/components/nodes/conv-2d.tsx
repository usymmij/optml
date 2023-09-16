import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import { Conv2DType } from "./types";
import { Label } from "../ui/label";
import useStore from "@/lib/store";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import NodeTitle from "../node-title";

function Conv2D({ id, data }: NodeProps<Conv2DType>) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <MaxConnections
        type="target"
        maxConnections={2}
        position={Position.Left}
      />
      <MaxConnections
        type="source"
        maxConnections={2}
        position={Position.Right}
      />
      <div className="flex flex-col gap-3 px-2 py-1">
        <NodeTitle 
        title="2D Convolution"
        description={
          <>
            <p>
            2D convolutional layers are designed for processing two-dimensional grid-like data. They apply 2D convolutions to input images using a filter/kernel to detect features like edges, textures, and shapes. The filter slides over the image to learn spatial hierarchies. 2D convolutional layers are widely used in computer vision tasks, including image classification, object detection, and image segmentation
            </p>
          </>
          } 
        />
        <div className="flex flex-col gap-2">
          <Label>Filters</Label>
          <Input
            id="filters"
            type="number"
            min={1}
            value={data.filters}
            onChange={(e) =>
              updateNodeData(id, { ...data, filters: parseInt(e.target.value) })
            }
            placeholder="Filters..."
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Kernel Size</Label>
          <div className="flex flex-row gap-2">
            <Input
              id="kernel_size"
              type="number"
              min={1}
              value={data.kernel_size[0]}
              onChange={(e) =>
                updateNodeData(id, {
                  ...data,
                  kernel_size: [parseInt(e.target.value), data.kernel_size[1]],
                })
              }
              placeholder="X..."
              className="w-[90px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Input
              id="kernel_size"
              type="number"
              min={1}
              value={data.kernel_size[1]}
              onChange={(e) =>
                updateNodeData(id, {
                  ...data,
                  kernel_size: [data.kernel_size[0], parseInt(e.target.value)],
                })
              }
              placeholder="Y..."
              className="w-[90px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Strides</Label>
          <Input
            id="strides"
            type="number"
            min={1}
            value={data.strides}
            onChange={(e) =>
              updateNodeData(id, { ...data, strides: parseInt(e.target.value) })
            }
            placeholder="Strides..."
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Padding</Label>
          <Select
            value={data.padding}
            onValueChange={(value) => {
              updateNodeData(id, { ...data, padding: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Padding type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="same">Same</SelectItem>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

export default memo(Conv2D);
