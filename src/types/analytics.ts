export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface WeeklySpending {
  week: string;
  amount: number;
}

export interface PriceTrend {
  productId: string;
  productName: string;
  previousPrice: number;
  currentPrice: number;
  percentageChange: number;
}

export interface SpendingSummary {
  totalSpent: number;
  averageDaily: number;
  averageWeekly: number;
  projectedMonthly: number;
  highestCategory: string;
  lowestCategory: string;
}
