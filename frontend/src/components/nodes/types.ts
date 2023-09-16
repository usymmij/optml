import { type } from "os";
import * as z from "zod";

export type NodeData = {
  label: string;
};

export const DataInput = z.object({
  shape: z.array(z.number()),
});

export type DataInputType = z.infer<typeof DataInput>;

export const Dense = z.object({
  units: z.number(),
  activation: z.union([
    z.literal("relu"),
    z.literal("sigmoid"),
    z.literal("softmax"),
  ]),
});

export type DenseType = z.infer<typeof Dense>;

export const Conv1D = z.object({
  filters: z.number(),
  kernel_size: z.number(),
  strides: z.number(),
  padding: z.union([
    z.literal("same"),
    z.literal("valid"),
    z.literal("casual"),
  ]),
});

export type Conv1DType = z.infer<typeof Conv1D>;
