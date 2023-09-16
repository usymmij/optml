import React, { memo, useCallback } from "react";
import {
  getConnectedEdges,
  Handle,
  ReactFlowState,
  useNodeId,
  useStore,
  type HandleProps,
} from "reactflow";

const selector =
  (nodeId: string | null, isConnectable = true, maxConnections = Infinity) =>
  (s: ReactFlowState) => {
    // If the user props say this handle is not connectable, we don't need to
    // bother checking anything else.
    if (!isConnectable || !nodeId) return false;

    const node = s.nodeInternals.get(nodeId);
    if (!node) return false;
    const connectedEdges = getConnectedEdges([node], s.edges);

    return connectedEdges.length < maxConnections;
  };

function MaxConnectionsHandle({
  maxConnections,
  ...props
}: {
  maxConnections: number;
} & HandleProps) {
  const nodeId = useNodeId();
  const isConnectable = useStore(
    useCallback(
      (s) => selector(nodeId, props.isConnectable, maxConnections)(s),
      [nodeId, props.isConnectable, maxConnections]
    )
  );

  return <Handle {...props} isConnectable={isConnectable} />;
}

export default memo(MaxConnectionsHandle);
