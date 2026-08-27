import { useState, useEffect } from "react";

/**
 * Returns `value` delayed by `delay` ms, updating only once `value`
 * has stopped changing. Every change cancels the previous pending update,
 * so rapid input emits once instead of once per change.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
