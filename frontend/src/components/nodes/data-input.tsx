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
        maxConnections={2}
        position={Position.Right}
      />
      <div className="flex flex-col gap-3 px-2 py-1">
        <NodeTitle
          title="Input"
          description={
            <p>
              The input layer is the first layer of a neural network,
              responsible for receiving and passing the raw input data to the
              subsequent layers. The number of neurons in the input layer
              typically corresponds to the number of features in the dataset.
            </p>
          }
        />
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
