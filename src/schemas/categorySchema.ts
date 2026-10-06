import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(60, "Category name must not exceed 60 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(250, "Description must not exceed 250 characters."),
});

export type CategoryFormData = z.infer<
  typeof categorySchema
>;
