import type { Node } from "reactflow";

export type Nodes =
  | "data-input"
  | "side-default"
  | "side-output"
  | "side-input"
  | "dense"
  | "normalization"
  | "batch-normalization"
  | "conv1d"
  | "conv2d"
  | "conv3d";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "data-input",
    data: { shape: [64, 64, 3] },
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
  {
    id: "4",
    type: "dense",
    data: { units: 16, activation: "relu" },
    position: { x: 300, y: 125 },
  },
  {
    id: "5",
    type: "normalization",
    data: {},
    position: { x: 300, y: 225 },
  },
  {
    id: "6",
    type: "batch-normalization",
    data: {},
    position: { x: 300, y: 325 },
  },
  {
    id: "7",
    type: "conv1d",
    data: { filters: 16, kernel_size: 3, strides: 1, padding: "same" },
    position: { x: 300, y: 425 },
  },
  {
    id: "8",
    type: "conv2d",
    data: { filters: 16, kernel_size: [3, 3], strides: 1, padding: "same" },
    position: { x: 300, y: 525 },
  },
  {
    id: "9",
    type: "conv3d",
    data: { filters: 16, kernel_size: [3, 3, 3], strides: 1, padding: "same" },
    position: { x: 300, y: 625 },
  },
];

export default initialNodes;
