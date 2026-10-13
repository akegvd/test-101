import { renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FundCard } from '@/components/FundCard';
import { useFundSearch } from '@/hooks/useFundSearch';
import { funds as allFunds } from '@/mocks/data';
import type { Fund } from '@/types';
import { renderWithProviders } from '@/test/renderWithProviders';

// ❌ All 3 tests pass today. Each one is wrong in a different way (see README).

describe('FundCard', () => {
  it('shows the fund name', async () => {
    renderWithProviders(<FundCard fundId="1" />);

    await new Promise((resolve) => setTimeout(resolve, 100)); // "the API is fast enough"

    expect(screen.getByRole('heading', { name: 'Fund A' })).toBeInTheDocument();
  });

  it('shows the NAV', () => {
    renderWithProviders(<FundCard fundId="1" />);

    // ESLint catches this one (testing-library/await-async-queries). Turned off here to show it.
    // eslint-disable-next-line testing-library/await-async-queries
    expect(screen.findByText('NAV: 12.50')).toBeTruthy();
  });
});

// Shared between tests and changed by one of them.
const funds: Fund[] = [...allFunds];

describe('useFundSearch', () => {
  it('empty query → returns all 7 funds', () => {
    const { result } = renderHook(() => useFundSearch(funds));

    expect(result.current.results).toHaveLength(7);
  });

  it('a new fund shows up in the results', () => {
    funds.push({ id: '8', name: 'Fund H', nav: 10, minAmount: 100 });

    const { result } = renderHook(() => useFundSearch(funds));

    expect(result.current.results).toHaveLength(8);
  });
});
