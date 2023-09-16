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

export const Conv2D = z.object({
  filters: z.number(),
  kernel_size: z.array(z.number()).max(2).min(2),
  strides: z.number(),
  padding: z.union([
    z.literal("same"),
    z.literal("valid"),
    z.literal("casual"),
  ]),
});

export type Conv2DType = z.infer<typeof Conv2D>;

export const Conv3D = z.object({
  filters: z.number(),
  kernel_size: z.array(z.number()).max(3).min(3),
  strides: z.number(),
  padding: z.union([
    z.literal("same"),
    z.literal("valid"),
    z.literal("casual"),
  ]),
});

export type Conv3DType = z.infer<typeof Conv3D>;

export const Dropout = z.object({
  rate: z.number().max(1).min(0),
});

export type DropoutType = z.infer<typeof Dropout>;
