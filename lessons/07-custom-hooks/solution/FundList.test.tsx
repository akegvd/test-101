import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FundList } from '@/components/FundList';
import type { Fund } from '@/types';

const fundA: Fund = { id: '1', name: 'Fund A', nav: 10, minAmount: 1000 };
const fundB: Fund = { id: '2', name: 'Fund B', nav: 20, minAmount: 1000 };

// The same search, tested through the component. This test does not know
// about the 300ms debounce. It only waits for the screen to change.
describe('FundList', () => {
  it('typing "Fund B" → only Fund B is listed', async () => {
    const user = userEvent.setup();
    render(<FundList funds={[fundA, fundB]} onSelect={vi.fn()} />);

    await user.type(screen.getByRole('searchbox', { name: 'Search funds' }), 'Fund B');

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Fund A' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Fund B' })).toBeInTheDocument();
  });

  it('no match → shows "No funds found"', async () => {
    const user = userEvent.setup();
    render(<FundList funds={[fundA, fundB]} onSelect={vi.fn()} />);

    await user.type(screen.getByRole('searchbox', { name: 'Search funds' }), 'xyz');

    expect(await screen.findByText('No funds found')).toBeInTheDocument();
  });

  it('click a fund → calls onSelect with that fund', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<FundList funds={[fundA, fundB]} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Fund B' }));

    expect(onSelect).toHaveBeenCalledWith(fundB);
  });
});
