import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import { DataInputType } from "./types";
import useStore from "@/lib/store";
import ShapeInput from "../shape-input";
import NodeTitle from "../node-title";
import { Label } from "../ui/label";

function DataInput({ id, data }: NodeProps<DataInputType>) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <MaxConnections
        type="source"
        maxConnections={1}
        position={Position.Right}
      />
      <div className="flex flex-col gap-3 px-2 py-1">
        <NodeTitle title="Input" />
        <div className="flex flex-col gap-2">
          <Label>Shape</Label>
          <ShapeInput
            value={data.shape}
            onChange={(value) => updateNodeData(id, { ...data, shape: value })}
          />
        </div>
      </div>
    </>
  );
}

export default memo(DataInput);
