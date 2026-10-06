import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(100, "Product name must not exceed 100 characters."),

  category: z
    .string()
    .min(1, "Please select a category."),

  unit: z
    .string()
    .min(1, "Please select a unit."),

  estimatedPrice: z
    .number({
      error: "Estimated price is required.",
    })
    .positive("Estimated price must be greater than 0.")
    .max(100000, "Estimated price is too high."),
});

export type ProductFormData = z.infer<typeof productSchema>;
