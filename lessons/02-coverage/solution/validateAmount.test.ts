import { describe, expect, it } from 'vitest';
import { validateAmount } from '@/utils/validateAmount';

describe('validateAmount', () => {
  const limits = { min: 1000, balance: 50000 };

  it('amount between min and balance → null', () => {
    expect(validateAmount('5000', limits)).toBeNull();
  });

  it.each([
    { input: '1000', case: 'exactly the minimum' },
    { input: '50000', case: 'exactly the balance' },
  ])('$case ($input) → null', ({ input }) => {
    expect(validateAmount(input, limits)).toBeNull();
  });

  it.each([
    { input: '', expected: 'Please enter an amount' },
    { input: '   ', expected: 'Please enter an amount' },
    { input: 'abc', expected: 'Please enter a number' },
    { input: '999', expected: 'Minimum amount is 1,000.00' },
    { input: '50001', expected: 'Insufficient balance' },
  ])('"$input" → "$expected"', ({ input, expected }) => {
    expect(validateAmount(input, limits)).toBe(expected);
  });
});
