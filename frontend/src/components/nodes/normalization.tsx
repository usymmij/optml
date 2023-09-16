import { memo } from "react";
import { Handle, Position } from "reactflow";

function Normalization() {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <h2 className="text-lg font-semibold">Normalization</h2>
    </>
  );
}

export default memo(Normalization);
