import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "./types";

function SideDefault({ data }: NodeProps<NodeData>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      {data.label}
    </>
  );
}

export default memo(SideDefault);
