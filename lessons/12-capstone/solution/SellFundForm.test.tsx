import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SellFundForm } from '@/components/SellFundForm';
import type { Fund } from '@/types';

const fundA: Fund = { id: '1', name: 'Fund A', nav: 12.5, minAmount: 1000 };

function renderForm({ daysHeld = 60 } = {}) {
  const onSubmit = vi.fn();
  render(<SellFundForm fund={fundA} unitsHeld={100} daysHeld={daysHeld} onSubmit={onSubmit} />);
  return { onSubmit, user: userEvent.setup(), input: screen.getByLabelText('Units') };
}

describe('SellFundForm', () => {
  it('nothing typed yet → Sell is disabled and no error is shown', () => {
    renderForm();

    expect(screen.getByRole('form', { name: 'Sell Fund A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sell' })).toBeDisabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('valid units → shows the money you get and sends the units', async () => {
    const { onSubmit, user, input } = renderForm();

    await user.type(input, '40');
    expect(screen.getByText('You get 500.00 THB')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sell' }));
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(40);
  });

  it('"Sell all" fills in every unit you hold', async () => {
    const { user, input } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Sell all' }));

    expect(input).toHaveValue('100');
    expect(screen.getByText('You get 1,250.00 THB')).toBeInTheDocument();
  });

  it('held less than 30 days → shows the fee note and takes 0.5%', async () => {
    const { user, input } = renderForm({ daysHeld: 29 });

    expect(screen.getByText('Held less than 30 days: 0.5% fee')).toBeInTheDocument();
    await user.type(input, '100');
    expect(screen.getByText('You get 1,243.75 THB')).toBeInTheDocument();
  });

  it('held 30 days → no fee note', () => {
    renderForm({ daysHeld: 30 });

    expect(screen.queryByText(/0.5% fee/)).not.toBeInTheDocument();
  });

  it.each([
    ['   ', 'Please enter units'],
    ['abc', 'Units must be greater than 0'],
    ['0', 'Units must be greater than 0'],
    ['100.5', 'You only have 100 units'],
  ])('"%s" → shows "%s" and cannot sell', async (typed, message) => {
    const { onSubmit, user, input } = renderForm();

    await user.type(input, typed);
    await user.click(screen.getByRole('button', { name: 'Sell' }));

    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(screen.queryByText(/You get/)).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('exactly the units you hold is allowed', async () => {
    const { user, input } = renderForm();

    await user.type(input, '100');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sell' })).toBeEnabled();
  });
});
