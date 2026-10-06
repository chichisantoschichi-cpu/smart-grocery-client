export interface ShoppingListItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  unit: string;
  quantity: number;
  estimatedPrice: number;
  checked: boolean;
}

export const initialShoppingList: ShoppingListItem[] = [
  {
    id: "list-001",
    productId: "product-001",
    productName: "Rice",
    category: "Rice & Grains",
    unit: "kg",
    quantity: 5,
    estimatedPrice: 60,
    checked: true,
  },
  {
    id: "list-002",
    productId: "product-002",
    productName: "Chicken Breast",
    category: "Meat & Poultry",
    unit: "kg",
    quantity: 2,
    estimatedPrice: 320,
    checked: false,
  },
  {
    id: "list-003",
    productId: "product-003",
    productName: "Fresh Milk",
    category: "Dairy",
    unit: "liter",
    quantity: 2,
    estimatedPrice: 95,
    checked: false,
  },
  {
    id: "list-004",
    productId: "product-004",
    productName: "Eggs",
    category: "Dairy",
    unit: "dozen",
    quantity: 2,
    estimatedPrice: 125,
    checked: true,
  },
  {
    id: "list-005",
    productId: "product-005",
    productName: "Tomato",
    category: "Vegetables",
    unit: "kg",
    quantity: 2,
    estimatedPrice: 120,
    checked: false,
  },
  {
    id: "list-006",
    productId: "product-006",
    productName: "Cooking Oil",
    category: "Pantry",
    unit: "liter",
    quantity: 1,
    estimatedPrice: 145,
    checked: false,
  },
  {
    id: "list-007",
    productId: "product-007",
    productName: "Bread",
    category: "Bakery",
    unit: "pack",
    quantity: 2,
    estimatedPrice: 85,
    checked: false,
  },
  {
    id: "list-008",
    productId: "product-008",
    productName: "Mineral Water",
    category: "Beverages",
    unit: "bottle",
    quantity: 12,
    estimatedPrice: 25,
    checked: false,
  },
];
