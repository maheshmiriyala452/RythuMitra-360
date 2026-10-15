import { useState, useEffect, useCallback } from 'react';

/**
 * useFetch — Custom hook for standardized asynchronous service data fetching
 * @param {Function} fetchFunction - An async function that returns a promise
 * @param {Array} dependencies - React dependencies that trigger refetching
 */
export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    let isMounted = true;
    executeFetch().catch((err) => {
      if (isMounted) setError(err.message);
    });
    return () => {
      isMounted = false;
    };
  }, [executeFetch]);

  return { data, loading, error, refetch: executeFetch, setData };
};

export default useFetch;
