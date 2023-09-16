import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

function SideOutput({
  data,
}: NodeProps<{
  label: string;
}>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      {data.label}
    </>
  );
}

export default memo(SideOutput);