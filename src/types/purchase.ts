export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Purchase {
  id: string;
  storeId: string;
  storeName?: string;
  purchaseDate: string;
  items: PurchaseItem[];
  totalAmount: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
