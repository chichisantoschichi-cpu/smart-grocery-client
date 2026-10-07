import type { BudgetHealth } from "./budget";

export interface AnalyticsSummary {
  totalSpending: number;
  purchaseCount: number;
  itemCount: number;
  averagePerPurchase: number;
  highestCategory: { name: string; total: number } | null;
  lowestCategory: { name: string; total: number } | null;
  topProduct: { name: string; total: number; timesBought: number } | null;
  mostVisitedStore: { name: string; visits: number } | null;
}

export interface MonthSpending {
  month: string;
  spent: number;
  purchaseCount: number;
  budget: number | null;
  budgetStatus: BudgetHealth | null;
  changePercent: number | null;
}

export interface MonthlySpendingReport {
  year: number;
  total: number;
  monthlyAverage: number;
  highestMonth: string | null;
  lowestMonth: string | null;
  months: MonthSpending[];
}

export interface CategoryShare {
  categoryId: string;
  name: string;
  total: number;
  itemCount: number;
  percent: number;
}

export interface CategoryBreakdown {
  total: number;
  categories: CategoryShare[];
}

export interface StorePrice {
  storeName: string;
  averagePrice: number;
  timesBought: number;
}

export interface StoreComparison {
  productId: string;
  productName: string;
  stores: StorePrice[];
  cheapestStore: string;
  priceDifference: number;
}
