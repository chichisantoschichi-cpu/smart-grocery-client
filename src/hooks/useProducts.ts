import api from "../api/axios";
import type { Product } from "../types";
import { useApi } from "./useApi";

export function useProducts() {
  const { data, setData, loading, error, refetch } = useApi<Product[]>("/products");

  const deleteProduct = async (id: string) => {
    await api.delete(`/products/${id}`);
    setData((prev) => prev?.filter((product) => product.id !== id) ?? null);
  };

  return { products: data ?? [], loading, error, refetch, deleteProduct };
}
