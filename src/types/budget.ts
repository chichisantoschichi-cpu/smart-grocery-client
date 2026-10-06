export interface Budget {
  id: string;
  month: string;
  year: number;
  amount: number;
  spent: number;
  createdAt?: string;
  updatedAt?: string;
}
