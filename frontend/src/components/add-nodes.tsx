import { LucidePlus } from "lucide-react";
import DragNode from "./drag-node";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function AddNodes() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <LucidePlus /> Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-20">
        <h3 className="text-lg font-semibold mb-2">Add Node</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <DragNode nodeType="data-input">Input</DragNode>
          <DragNode nodeType="conv1d">Conv1D</DragNode>
          <DragNode nodeType="conv2d">Conv2D</DragNode>
          <DragNode nodeType="conv3d">Conv3D</DragNode>
          <DragNode nodeType="dense">Dense</DragNode>
          <DragNode nodeType="dropout">Dropout</DragNode>
          <DragNode nodeType="flatten">Flatten</DragNode>
          <DragNode nodeType="normalization">Norm</DragNode>
          <DragNode nodeType="batch-normalization">Batch Norm</DragNode>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AddNodes;
