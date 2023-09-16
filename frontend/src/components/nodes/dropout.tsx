import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import { DropoutType } from "./types";
import { Label } from "../ui/label";
import useStore from "@/lib/store";
import { Input } from "../ui/input";
import NodeTitle from "../node-title";
import { Slider } from "../ui/slider";

function Dropout({ id, data }: NodeProps<DropoutType>) {
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
          title="Dropout"
          description={
            <p>
              Dropout is a regularization technique rather than a traditional
              layer. Dropout layers randomly drop a specified fraction of
              neurons during training, which helps prevent overfitting by
              reducing reliance on any single neuron{"'"}s output.
            </p>
          }
        />
        <div className="flex flex-col gap-2">
          <Label>Rate</Label>
          <div className="grid grid-cols-4 gap-2">
            <Slider
              className="col-span-3"
              min={0}
              max={1}
              step={0.01}
              value={[data.rate]}
              onValueChange={(e) =>
                updateNodeData(id, {
                  ...data,
                  rate: e[0],
                })
              }
            />
            <Input
              id="units"
              type="number"
              disabled
              min={0}
              max={1}
              value={data.rate}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Dropout);
