import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that updates after `delay` ms of inactivity.
 */
export function useDebounce(value, delay = 600) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
