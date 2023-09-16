import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import { Conv1DType } from "./types";
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

function Conv1D({ id, data }: NodeProps<Conv1DType>) {
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
          title="1D Convolution"
          description={
            <p>
              1D convolutional layers are used for processing one-dimensional
              data sequences. They perform 1D convolutions, sliding a
              kernel/filter along the input sequence to extract features,
              detecting patterns, and learning representations relevant to the
              task. 1D convolutional layers are often used in tasks like natural
              language processing (NLP) for text classification, sentiment
              analysis, and speech recognition.
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
            className="w-[180px] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Kernel Size</Label>
          <Input
            id="kernel_size"
            type="number"
            min={1}
            value={data.kernel_size}
            onChange={(e) =>
              updateNodeData(id, {
                ...data,
                kernel_size: parseInt(e.target.value),
              })
            }
            placeholder="X..."
            className="w-[180px] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
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
            className="w-[180px] focus-visible:ring-0 focus-visible:ring-offset-0"
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
            <SelectTrigger className="w-[180px]">
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

export default memo(Conv1D);
