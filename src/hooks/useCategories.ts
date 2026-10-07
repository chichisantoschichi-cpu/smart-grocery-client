import api from "../api/axios";
import type { Category } from "../types";
import { useApi } from "./useApi";

export function useCategories() {
  const { data, setData, loading, error, refetch } = useApi<Category[]>("/categories");

  const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
    setData((prev) => prev?.filter((category) => category.id !== id) ?? null);
  };

  return { categories: data ?? [], loading, error, refetch, deleteCategory };
}
