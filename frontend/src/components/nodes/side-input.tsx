import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

function SideInput({
  data,
}: NodeProps<{
  label: string;
}>) {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      {data.label}
    </>
  );
}

export default memo(SideInput);