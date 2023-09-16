import { DragEvent } from "react";
import { Button } from "./ui/button";
import { PropsWithChildren } from "react";
import { Nodes } from "@/lib/nodes";

export default function DragNode({
  className,
  nodeType,
  children,
}: PropsWithChildren<{
  className?: string;
  nodeType: Nodes;
}>) {
  const onDragStart = (event: DragEvent) => {
    if (event.dataTransfer === null) return;
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button className={className} onDragStart={onDragStart} draggable>
      {children}
    </Button>
  );
}
