import { useEffect, useRef, useState } from "react";

/**
 * Returns a debounced copy of `value` that updates after `delay` ms of inactivity.
 */
export function useDebounce(value, delay = 600) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setDebouncedValue(value);
      return undefined;
    }

    const timer = setTimeout(() => {
      setDebouncedValue((previous) => (previous === value ? previous : value));
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Runs `callback` only after `delay` ms of inactivity across `deps` changes.
 */
export function useDebouncedEffect(callback, deps, delay = 600) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const timer = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => clearTimeout(timer);
  }, [...deps, delay]);
}
