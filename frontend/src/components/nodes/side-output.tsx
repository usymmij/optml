import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "./types";

function SideOutput({ data }: NodeProps<NodeData>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      {data.label}
    </>
  );
}

export default memo(SideOutput);
