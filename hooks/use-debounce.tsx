import { useState, useEffect } from "react";

export function useDebouncedValue<T extends string>(
  value: T,
  delay: number = 500
): { debouncedValue: T } {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue };
}
