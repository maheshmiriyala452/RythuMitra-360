import { useState, useEffect } from 'react';

/**
 * useDebounce — Custom hook to debounce fast-changing state (e.g. search input fields)
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms)
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
