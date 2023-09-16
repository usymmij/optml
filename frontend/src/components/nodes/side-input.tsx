import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "./types";

function SideInput({ data }: NodeProps<NodeData>) {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      {data.label}
    </>
  );
}

export default memo(SideInput);
