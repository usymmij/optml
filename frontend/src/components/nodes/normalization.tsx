import { memo } from "react";
import { Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import InfoDialog from "../info-dialog";

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
      <div className="flex flex-row gap-2 justify-center items-center">
        <h2 className="text-lg font-semibold"> Normalization</h2>
        <InfoDialog
          title="Layer Normalization"
          className="hover:cursor-pointer"
        >
          <p>
            Layer normalization computes the mean and standard deviation of the
            activations across neurons within a layer for each data point
            separately, allowing for normalization without relying on batch
            statistics.Layer normalization is commonly used in recurrent neural
            networks (RNNs) and transformer architectures
          </p>
        </InfoDialog>
      </div>
    </>
  );
}

export default memo(Normalization);
