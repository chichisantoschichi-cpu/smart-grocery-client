export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  createdAt?: string;
  updatedAt?: string;
}
