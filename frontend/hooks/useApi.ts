import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type ApiExecutor<T> = (...args: any[]) => Promise<T>;

/**
 * Generic typed fetch hook.
 * Usage:
 *   const { data, loading, error, execute } = useApi(fetchFn, initialData);
 */
export function useApi<T>(
  fetcher: ApiExecutor<T>,
  initial: T | null = null
): ApiState<T> & { execute: (...args: any[]) => Promise<void>; reset: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: initial,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcher(...args);
      setState({ data, loading: false, error: null });
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err.message || 'An error occurred' }));
    }
  }, [fetcher]);

  const reset = useCallback(() => {
    setState({ data: initial, loading: false, error: null });
  }, [initial]);

  return { ...state, execute, reset };
}

/**
 * Authenticated fetch helper — automatically appends Bearer token from cookie.
 */
export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getCookie('il_access_token');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}
