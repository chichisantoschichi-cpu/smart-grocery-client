import { useEffect, useState } from "react";

import api from "../api/axios";
import type { Category } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    api
      .get<Category[]>("/categories")
      .then(({ data }) => {
        if (!ignore) {
          setCategories(data);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const refetch = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  return { categories, loading, error, refetch, deleteCategory };
}
