import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters.")
      .max(100, "Product name must not exceed 100 characters."),

    categoryId: z.string().min(1, "Please select a category."),

    unit: z.string().min(1, "Please select a unit."),

    price: z
      .number({
        error: "Price is required.",
      })
      .positive("Price must be greater than 0.")
      .max(100000, "Price is too high."),

    stock: z
      .number({
        error: "Stock is required.",
      })
      .min(0, "Stock cannot be negative."),

    minStock: z
      .number({
        error: "Minimum stock is required.",
      })
      .min(0, "Minimum stock cannot be negative."),
  });

export type ProductFormData = z.infer<typeof productSchema>;
