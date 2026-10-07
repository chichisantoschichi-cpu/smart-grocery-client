import { useEffect, useState } from "react";

import api from "../api/axios";

interface ApiState<T> {
  key: string | null;
  data: T | null;
  error: string | null;
}

// Fetches a GET endpoint and tracks loading and error state.
// Pass null as the url to skip the request (e.g. while an id is missing).
export function useApi<T>(url: string | null) {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<ApiState<T>>({ key: null, data: null, error: null });

  // Each url + reload counts as its own request; loading means its response hasn't arrived yet
  const requestKey = url === null ? null : `${url}#${reloadKey}`;

  useEffect(() => {
    if (url === null || requestKey === null) return;
    let ignore = false;

    api
      .get<T>(url)
      .then(({ data }) => {
        if (!ignore) setState({ key: requestKey, data, error: null });
      })
      .catch((err: Error) => {
        if (!ignore) setState((prev) => ({ key: requestKey, data: prev.data, error: err.message }));
      });

    return () => {
      ignore = true;
    };
  }, [url, requestKey]);

  const loading = requestKey !== null && state.key !== requestKey;

  const setData = (update: (prev: T | null) => T | null) =>
    setState((prev) => ({ ...prev, data: update(prev.data) }));

  const refetch = () => setReloadKey((key) => key + 1);

  return { data: state.data, setData, loading, error: state.error, refetch };
}
