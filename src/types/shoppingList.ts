export interface ShoppingListItem {
  id: string;
  productId?: string;
  productName: string;
  category?: string;
  quantity: number;
  estimatedPrice: number;
  completed: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt?: string;
  updatedAt?: string;
}
