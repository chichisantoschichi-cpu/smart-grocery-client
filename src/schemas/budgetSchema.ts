import { z } from "zod";

export const budgetSchema = z.object({
  month: z
    .string()
    .min(1, "Please select a month."),

  year: z
    .number({
      error: "Year is required.",
    })
    .int("Year must be a whole number.")
    .min(2020, "Year must be 2020 or later.")
    .max(2100, "Please enter a valid year."),

  amount: z
    .number({
      error: "Budget amount is required.",
    })
    .positive("Budget amount must be greater than 0.")
    .max(1000000, "Budget amount is too high."),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
