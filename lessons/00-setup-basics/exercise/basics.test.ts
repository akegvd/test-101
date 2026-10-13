import { describe, expect, it, test } from 'vitest';
import { formatAmount } from '@/utils/formatAmount';

// This first test is done for you. Run it, then make it fail on purpose
// (change '1,000.00' to '1000.00') to see what a failure looks like.
test('formatAmount: 1000 → "1,000.00"', () => {
  expect(formatAmount(1000)).toBe('1,000.00');
});

// TODO: replace each `it.todo` with a real test. Use the matcher in the name.
// You will need: import { validateAmount } from '@/utils/validateAmount';
//                import { calcFee } from '@/utils/calcFee';
describe('validateAmount', () => {
  it.todo('valid amount → null (toBeNull)');
  it.todo('amount below the minimum → "Minimum amount is 1,000.00" (toBe)');
  it.todo('amount above the balance → message contains "balance" (toContain)');
});

describe('calcFee', () => {
  it.todo('amount 0 → throws "Amount must be greater than 0" (toThrow)');
});

describe('toBe vs toEqual', () => {
  it.todo('two objects with the same values are equal (toEqual) but not the same (not.toBe)');
});
