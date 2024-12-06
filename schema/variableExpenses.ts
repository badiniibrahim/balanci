import { z } from "zod";

export const VariableExpensesSchema = z.object({
  budgetAmount: z.coerce.number().positive().multipleOf(0.01),
  name: z.string(),
});

export type VariableExpensesType = z.infer<typeof VariableExpensesSchema>;
