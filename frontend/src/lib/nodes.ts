import type { Node } from "reactflow";

export type Nodes =
  | "data-input"
  | "dense"
  | "normalization"
  | "batch-normalization"
  | "conv1d"
  | "conv2d"
  | "conv3d"
  | "dropout"
  | "flatten";

export const defaultNodeData: { [key: string]: any } = {
  "data-input": {
    shape: [64, 64, 3],
  },
  dense: { units: 16, activation: "relu" },
  normalization: {},
  "batch-normalization": {},
  flatten: {},
  conv1d: { filters: 16, kernel_size: 3, strides: 1, padding: "same" },
  conv2d: { filters: 16, kernel_size: [3, 3], strides: 1, padding: "same" },
  conv3d: { filters: 16, kernel_size: [3, 3, 3], strides: 1, padding: "same" },
  dropout: { rate: 0.5 },
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "data-input",
    data: { shape: [64, 64, 3] },
    position: { x: 0, y: 20 },
  },
  {
    id: "2",
    type: "dense",
    data: { units: 16, activation: "relu" },
    position: { x: 300, y: 0 },
  },
];

export default initialNodes;
