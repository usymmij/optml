import { memo } from "react";
import { Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import InfoDialog from "../info-dialog";

function BatchNormalization() {
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
        <h2 className="text-lg font-semibold">Batch Normalization</h2>
        <InfoDialog
          title="Batch Normalization"
          className="hover:cursor-pointer"
        >
          <p>
            Batch normalization is used to compute the mean and standard
            deviation of the activations across the batch and then scales and
            shifts the activations using learned parameters to ensure proper
            normalization. Batch normalization is widely used to stabilize
            training, accelerate convergence, and reduce issues related to
            internal covariate shift.
          </p>
        </InfoDialog>
      </div>
    </>
  );
}

export default memo(BatchNormalization);
