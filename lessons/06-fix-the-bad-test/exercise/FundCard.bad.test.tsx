import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FundCard } from '@/components/FundCard';
import { useFund } from '@/hooks/useFund';
import { formatAmount } from '@/utils/formatAmount';

// ❌ BAD TEST (on purpose). It passes today. Read the lesson README first.
vi.mock('@/hooks/useFund');
vi.mock('@/utils/formatAmount');

describe('FundCard', () => {
  it('FundCard', () => {
    vi.mocked(useFund).mockReturnValue({
      data: { id: '1', name: 'Fund A', nav: 12.5, minAmount: 1000 },
      isPending: false,
      isError: false,
    } as ReturnType<typeof useFund>);
    vi.mocked(formatAmount).mockReturnValue('12.50');

    const { container } = render(<FundCard fundId="1" />);

    expect(useFund).toHaveBeenCalled();
    expect(useFund).toHaveBeenCalledWith('1');
    expect(formatAmount).toHaveBeenCalledWith(12.5);
    expect(container.querySelector('.fund-card__name')?.textContent).toBe('Fund A');
  });
});
