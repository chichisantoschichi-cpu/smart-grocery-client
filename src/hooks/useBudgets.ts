import api from "../api/axios";
import type { Budget } from "../types";
import { useApi } from "./useApi";

export function useBudgets() {
  const { data, setData, loading, error, refetch } = useApi<Budget[]>("/budgets");

  const deleteBudget = async (id: string) => {
    await api.delete(`/budgets/${id}`);
    setData((prev) => prev?.filter((budget) => budget.id !== id) ?? null);
  };

  return { budgets: data ?? [], loading, error, refetch, deleteBudget };
}
