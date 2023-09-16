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
          <DragNode nodeType="side-input">Input</DragNode>
          <DragNode nodeType="side-default">Default</DragNode>
          <DragNode nodeType="side-output">Output</DragNode>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AddNodes;
