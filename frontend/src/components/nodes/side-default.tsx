import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

function SideDefault({
  data,
}: NodeProps<{
  label: string;
}>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      {data.label}
    </>
  );
}

export default memo(SideDefault);
