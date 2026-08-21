import { useState, useEffect } from "react";
import { callAPI } from "@/api/callAPI";

export function useFetch<T>(endpoint: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await callAPI<T>([endpoint], controller.signal);
        setData(result);
      } catch (err) {
        // We aborted this request ourselves, so it is not a real error
        if (controller.signal.aborted) return;
        setError(err as Error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [endpoint]);

  return { data, loading, error };
}
