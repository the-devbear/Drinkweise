import { useCallback, useEffect, useRef, useState } from 'react';

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function useDebounceWithImmediate<T>(
  value: T,
  delay = 500
): [
  debouncedValue: T,
  setDebouncedValueImmediate: (value: T, shouldClearTimeout?: boolean) => void,
] {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      timeoutRef.current = null;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay]);

  const setDebouncedValueImmediate = useCallback((value: T, shouldClearTimeout = true) => {
    const prevTimeout = timeoutRef.current;
    if (shouldClearTimeout && prevTimeout) {
      clearTimeout(prevTimeout);
      timeoutRef.current = null;
    }
    setDebouncedValue(value);
  }, []);

  return [debouncedValue, setDebouncedValueImmediate];
}
