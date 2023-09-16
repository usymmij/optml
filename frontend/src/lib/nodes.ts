import type { Node } from "reactflow";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "side-input",
    data: { label: "Input" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "side-default",
    data: { label: "Default" },
    position: { x: 300, y: 25 },
  },
  {
    id: "3",
    type: "side-output",
    data: { label: "Output" },
    position: { x: 500, y: 25 },
  },
];

export default initialNodes;
