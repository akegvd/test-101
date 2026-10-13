import { describe, it } from 'vitest';

// TODO: write these with `it.each` and hard-coded expected values.
describe('formatAmount', () => {
  it.todo('adds a comma every 3 digits (1000 → "1,000.00", 1234567 → "1,234,567.00")');
  it.todo('always shows 2 decimals (5 → "5.00", 1234.5 → "1,234.50")');
  it.todo('rounds long decimals to 2 places (1.239 → "1.24")');
  it.todo('0 → "0.00"');
  it.todo('negative number → "-1,234.50"');
  it.todo('very large number → "1,000,000,000,000.00"');
  it.todo('null → "-"');
  it.todo('NaN → "-"');
});
