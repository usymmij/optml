import { memo } from "react";
import { Position } from "reactflow";
import MaxConnections from "../handles/max-connections";
import InfoDialog from "../info-dialog";

function Flatten() {
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
        <h2 className="text-lg font-semibold">Flatten</h2>
        <InfoDialog title="Flatten Layer" className="hover:cursor-pointer">
          <p>
            A flatten layer is used to convert multidimensional input data
            (e.g., output from convolutional layers) into a one-dimensional
            vector. This is often necessary when transitioning from
            convolutional layers to fully connected layers.
          </p>
        </InfoDialog>
      </div>
    </>
  );
}

export default memo(Flatten);
