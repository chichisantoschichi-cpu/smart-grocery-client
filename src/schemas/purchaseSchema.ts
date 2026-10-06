import { z } from "zod";

const purchaseItemSchema = z.object({
  productId: z
    .string()
    .min(1, "Please select a product."),

  productName: z
    .string()
    .min(1, "Product name is required."),

  quantity: z
    .number({
      error: "Quantity is required.",
    })
    .positive("Quantity must be greater than 0.")
    .max(10000, "Quantity is too large."),

  unitPrice: z
    .number({
      error: "Unit price is required.",
    })
    .positive("Unit price must be greater than 0.")
    .max(100000, "Unit price is too high."),
});

export const purchaseSchema = z.object({
  store: z
    .string()
    .min(1, "Please select a store."),

  purchaseDate: z
    .string()
    .min(1, "Purchase date is required."),

  notes: z
    .string()
    .max(300, "Notes must not exceed 300 characters.")
    .optional(),

  items: z
    .array(purchaseItemSchema)
    .min(1, "Add at least one grocery item."),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;
