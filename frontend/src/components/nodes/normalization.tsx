import { memo } from "react";
import { Position } from "reactflow";
import MaxConnections from "../handles/max-connections";

function Normalization() {
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
      <h2 className="text-lg font-semibold">Normalization</h2>
    </>
  );
}

export default memo(Normalization);
