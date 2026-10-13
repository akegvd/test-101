import { useEffect, useState } from 'react';
import type { Fund } from '@/types';

export const SEARCH_DELAY_MS = 300;

/** Filters funds by name. The filter runs 300ms after the user stops typing. */
export function useFundSearch(funds: Fund[]) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const text = debouncedQuery.trim().toLowerCase();
  const results = funds.filter((fund) => fund.name.toLowerCase().includes(text));

  return { query, setQuery, results };
}
