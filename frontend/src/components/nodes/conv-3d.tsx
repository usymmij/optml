import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import { Conv3DType } from "./types";
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

function Conv3D({ id, data }: NodeProps<Conv3DType>) {
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
          title="3D Convolution"
          description={
            <p>
              3D convolutional layers are used for processing three-dimensional
              data, such as video sequences or volumetric medical images.They
              perform 3D convolutions by sliding a 3D kernel/filter through the
              input data to capture spatiotemporal patterns, features, and
              relationships in the data. 3D convolutional layers are applied in
              tasks like video action recognition, 3D medical image analysis,
              and volumetric data processing.
            </p>
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
                  kernel_size: [
                    parseInt(e.target.value),
                    data.kernel_size[1],
                    data.kernel_size[2],
                  ],
                })
              }
              placeholder="X..."
              className="w-[75px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Input
              id="kernel_size"
              type="number"
              min={1}
              value={data.kernel_size[1]}
              onChange={(e) =>
                updateNodeData(id, {
                  ...data,
                  kernel_size: [
                    data.kernel_size[0],
                    parseInt(e.target.value),
                    data.kernel_size[2],
                  ],
                })
              }
              placeholder="Y..."
              className="w-[75px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Input
              id="kernel_size"
              type="number"
              min={1}
              value={data.kernel_size[1]}
              onChange={(e) =>
                updateNodeData(id, {
                  ...data,
                  kernel_size: [
                    data.kernel_size[0],
                    data.kernel_size[1],
                    parseInt(e.target.value),
                  ],
                })
              }
              placeholder="Z..."
              className="w-[75px] focus-visible:ring-0 focus-visible:ring-offset-0"
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

export default memo(Conv3D);
