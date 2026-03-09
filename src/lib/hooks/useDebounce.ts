"use client";

import { useState, useEffect, useCallback } from "react";

interface UseDebounceOptions {
  delay?: number;
  minLength?: number;
}

export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {}
): T {
  const { delay = 300 } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedSearch(
  onSearch: (query: string) => void,
  options: UseDebounceOptions = {}
) {
  const { delay = 300, minLength = 2 } = options;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, { delay });

  useEffect(() => {
    if (debouncedQuery.length === 0 || debouncedQuery.length >= minLength) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, minLength, onSearch]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    isSearching: searchQuery !== debouncedQuery,
  };
}

export function useDebounceCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = { current: undefined as ReturnType<typeof setTimeout> | undefined };

  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
}
