import { describe, it } from 'vitest';

// TODO: Arrange-Act-Assert. Hard-code every expected value.
describe('calcUnits', () => {
  it.todo('divides the amount by NAV (1000 / 10 → 100)');
  it.todo('rounds down to 4 decimals, never up (200 / 3 → 66.6666)');
  it.todo('amount 0 → 0 units');
  it.todo('NAV with many decimals (1000 / 8.2345 → 121.4402)');
  it.todo('very large amount (1,000,000,000 / 12.5 → 80,000,000)');
  it.todo('floating point trap (1004 / 12.5 → 80.32, not 80.3199)');
  it.todo('NAV 0, negative or NaN → throws "NAV must be greater than 0"');
  it.todo('negative or NaN amount → throws "Amount must be 0 or more"');
});
