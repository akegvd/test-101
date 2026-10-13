import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BuyFundForm } from '@/components/BuyFundForm';

// onSubmit is the component's output. A spy here is fine: we check what the
// component gives to its parent, not how it works inside.
function renderForm() {
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  render(<BuyFundForm minAmount={1000} balance={50000} onSubmit={onSubmit} />);
  return { user, onSubmit };
}

describe('BuyFundForm', () => {
  it('Buy button is disabled before the user types', () => {
    renderForm();

    expect(screen.getByRole('button', { name: 'Buy' })).toBeDisabled();
  });

  it('amount below the minimum → shows "Minimum amount is 1,000.00" and Buy is disabled', async () => {
    // Arrange
    const { user } = renderForm();

    // Act
    await user.type(screen.getByLabelText('Amount (THB)'), '999');

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('Minimum amount is 1,000.00');
    expect(screen.getByRole('button', { name: 'Buy' })).toBeDisabled();
  });

  it('amount above the balance → shows "Insufficient balance"', async () => {
    const { user } = renderForm();

    await user.type(screen.getByLabelText('Amount (THB)'), '50001');

    expect(screen.getByRole('alert')).toHaveTextContent('Insufficient balance');
  });

  it('text that is not a number → shows "Please enter a number"', async () => {
    const { user } = renderForm();

    await user.type(screen.getByLabelText('Amount (THB)'), 'abc');

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a number');
  });

  it('valid amount + click Buy → calls onSubmit once with the number 5000', async () => {
    const { user, onSubmit } = renderForm();

    await user.type(screen.getByLabelText('Amount (THB)'), '5000');
    await user.click(screen.getByRole('button', { name: 'Buy' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(5000);
  });

  it('valid amount → shows no error', async () => {
    const { user } = renderForm();

    await user.type(screen.getByLabelText('Amount (THB)'), '5000');

    // queryBy returns null instead of throwing, so it is the way to check "not there".
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buy' })).toBeEnabled();
  });

  it('marks the input as invalid for screen readers when there is an error', async () => {
    const { user } = renderForm();

    await user.type(screen.getByRole('textbox', { name: 'Amount (THB)' }), '1');

    expect(screen.getByRole('textbox', { name: 'Amount (THB)' })).toBeInvalid();
    expect(screen.getByRole('textbox', { name: 'Amount (THB)' })).toHaveAccessibleDescription(
      'Minimum amount is 1,000.00',
    );
  });
});
