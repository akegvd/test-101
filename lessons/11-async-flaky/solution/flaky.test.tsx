import { renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FundCard } from '@/components/FundCard';
import { useFundSearch } from '@/hooks/useFundSearch';
import { funds } from '@/mocks/data';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('FundCard', () => {
  // ✅ findBy waits until the heading shows up (up to 1s), however slow the API is.
  it('shows the fund name', async () => {
    renderWithProviders(<FundCard fundId="1" />);

    expect(await screen.findByRole('heading', { name: 'Fund A' })).toBeInTheDocument();
  });

  // ✅ await + expect: if the text never shows up, the test fails.
  it('shows the NAV', async () => {
    renderWithProviders(<FundCard fundId="1" />);

    expect(await screen.findByText('NAV: 12.50')).toBeInTheDocument();
  });
});

describe('useFundSearch', () => {
  // ✅ Each test builds its own data. The order does not matter any more.
  it('empty query → returns all 7 funds', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    expect(result.current.results).toHaveLength(7);
  });

  it('a new fund shows up in the results', () => {
    const withNewFund = [...funds, { id: '8', name: 'Fund H', nav: 10, minAmount: 100 }];

    const { result } = renderHook(() => useFundSearch(withNewFund));

    expect(result.current.results).toHaveLength(8);
  });
});
