import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFundSearch } from '@/hooks/useFundSearch';
import type { Fund } from '@/types';

const fundA: Fund = { id: '1', name: 'Fund A', nav: 10, minAmount: 1000 };
const fundB: Fund = { id: '2', name: 'Fund B', nav: 20, minAmount: 1000 };
const fundC: Fund = { id: '3', name: 'Fund C', nav: 30, minAmount: 1000 };
const funds = [fundA, fundB, fundC];

describe('useFundSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('empty query → returns all funds', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    expect(result.current.results).toEqual([fundA, fundB, fundC]);
  });

  it('does not filter before 300ms', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    act(() => result.current.setQuery('Fund B'));
    act(() => vi.advanceTimersByTime(299));

    expect(result.current.query).toBe('Fund B');
    expect(result.current.results).toEqual([fundA, fundB, fundC]);
  });

  it('filters by name after 300ms', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    act(() => result.current.setQuery('Fund B'));
    act(() => vi.advanceTimersByTime(300));

    expect(result.current.results).toEqual([fundB]);
  });

  it('ignores upper / lower case', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    act(() => result.current.setQuery('fUnD c'));
    act(() => vi.advanceTimersByTime(300));

    expect(result.current.results).toEqual([fundC]);
  });

  it('typing again restarts the 300ms wait', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    act(() => result.current.setQuery('Fund'));
    act(() => vi.advanceTimersByTime(200));
    act(() => result.current.setQuery('Fund A'));
    act(() => vi.advanceTimersByTime(200));

    // 400ms since the first key, but only 200ms since the last one → not filtered yet
    expect(result.current.results).toEqual([fundA, fundB, fundC]);

    act(() => vi.advanceTimersByTime(100));

    expect(result.current.results).toEqual([fundA]);
  });

  it('no match → empty list', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    act(() => result.current.setQuery('Fund Z'));
    act(() => vi.advanceTimersByTime(300));

    expect(result.current.results).toEqual([]);
  });
});
