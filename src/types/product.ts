export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  stockStatus: StockStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LowStockProduct extends Product {
  suggestedQuantity: number;
  estimatedCost: number;
}

export interface LowStockResponse {
  count: number;
  totalEstimatedCost: number;
  products: LowStockProduct[];
}

export interface PriceHistoryEntry {
  date: string;
  storeName?: string;
  unitPrice: number;
  quantity: number;
}

export interface PriceHistory {
  productId: string;
  productName: string;
  currentPrice: number;
  history: PriceHistoryEntry[];
  stats: {
    lowest: number;
    highest: number;
    average: number;
    changeAmount: number;
    changePercent: number;
    trend: "up" | "down" | "stable";
  } | null;
}
