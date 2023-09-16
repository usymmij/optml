import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import { DenseType } from "./types";
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

function DataInput({ id, data }: NodeProps<DenseType>) {
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
        <NodeTitle title="Dense" />
        <div className="flex flex-col gap-2">
          <Label>Units</Label>
          <Input
            id="units"
            type="number"
            min={1}
            value={data.units}
            onChange={(e) =>
              updateNodeData(id, { ...data, units: parseInt(e.target.value) })
            }
            placeholder="Units..."
            className="w-[180px] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Activation</Label>
          <Select
            value={data.activation}
            onValueChange={(value) => {
              updateNodeData(id, { ...data, activation: value });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Activation type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relu">Relu</SelectItem>
              <SelectItem value="sigmoid">Sigmoid</SelectItem>
              <SelectItem value="softmax">Softmax</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

export default memo(DataInput);
