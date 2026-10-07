import api from "../api/axios";
import type { Purchase } from "../types";
import { useApi } from "./useApi";

export function usePurchases() {
  const { data, setData, loading, error, refetch } = useApi<Purchase[]>("/purchases");

  const deletePurchase = async (id: string) => {
    await api.delete(`/purchases/${id}`);
    setData((prev) => prev?.filter((purchase) => purchase.id !== id) ?? null);
  };

  return { purchases: data ?? [], loading, error, refetch, deletePurchase };
}
