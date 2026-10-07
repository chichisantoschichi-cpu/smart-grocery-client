export type BudgetHealth = "on-track" | "warning" | "over-budget";

export interface Budget {
  id: string;
  month: string;
  year: number;
  amount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  status: BudgetHealth;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetStatus {
  id: string;
  month: string;
  year: number;
  amount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  status: BudgetHealth;
  purchaseCount: number;
  period: "past" | "current" | "upcoming";
  daysInMonth: number;
  daysElapsed: number;
  daysRemaining: number;
  dailyAverage: number;
  dailyAllowance: number;
  projectedSpending: number;
  projectedToExceed: boolean;
}
