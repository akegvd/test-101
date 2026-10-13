import { describe, it } from 'vitest';

// TODO: test like a user. Type, click, then check what is on screen.
// Render with: render(<BuyFundForm minAmount={1000} balance={50000} onSubmit={onSubmit} />)
// You will need: render, screen (@testing-library/react), userEvent (@testing-library/user-event), vi (vitest)
describe('BuyFundForm', () => {
  it.todo('Buy button is disabled before the user types');
  it.todo('amount below the minimum → shows "Minimum amount is 1,000.00" and Buy is disabled');
  it.todo('amount above the balance → shows "Insufficient balance"');
  it.todo('text that is not a number → shows "Please enter a number"');
  it.todo('valid amount + click Buy → calls onSubmit once with the number 5000');
  it.todo('valid amount → shows no error (use queryByRole)');
});
