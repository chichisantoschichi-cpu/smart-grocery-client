import { z } from "zod";

export const shoppingListItemSchema = z.object({
  productId: z
    .string()
    .min(1, "Please select a product."),

  quantity: z
    .number({
      error: "Quantity is required.",
    })
    .positive("Quantity must be greater than 0.")
    .max(10000, "Quantity is too large."),
});

export type ShoppingListItemFormData = z.infer<
  typeof shoppingListItemSchema
>;
