import type { Store } from "../types";
import { useApi } from "./useApi";

export function useStores() {
  const { data, loading, error, refetch } = useApi<Store[]>("/stores");
  return { stores: data ?? [], loading, error, refetch };
}
