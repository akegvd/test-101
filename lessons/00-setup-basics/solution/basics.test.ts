import { describe, expect, it, test } from 'vitest';
import { calcFee } from '@/utils/calcFee';
import { formatAmount } from '@/utils/formatAmount';
import { validateAmount } from '@/utils/validateAmount';

// Top level: use `test`.
test('formatAmount: 1000 → "1,000.00"', () => {
  expect(formatAmount(1000)).toBe('1,000.00');
});

// Inside `describe`: use `it`. It reads like a sentence: "validateAmount ... it returns ..."
describe('validateAmount', () => {
  const limits = { min: 1000, balance: 50000 };

  it('valid amount → null', () => {
    expect(validateAmount('5000', limits)).toBeNull();
  });

  it('amount below the minimum → "Minimum amount is 1,000.00"', () => {
    expect(validateAmount('999', limits)).toBe('Minimum amount is 1,000.00');
  });

  it('amount above the balance → message contains "balance"', () => {
    expect(validateAmount('50001', limits)).toContain('balance');
  });
});

describe('calcFee', () => {
  it('amount 0 → throws "Amount must be greater than 0"', () => {
    // toThrow needs a function. calcFee(0, false) without `() =>` would throw before expect runs.
    expect(() => calcFee(0, false)).toThrow('Amount must be greater than 0');
  });
});

describe('toBe vs toEqual', () => {
  it('two objects with the same values are equal (toEqual) but not the same (not.toBe)', () => {
    const order = { fundId: '1', amount: 5000 };
    const sameValues = { fundId: '1', amount: 5000 };

    expect(sameValues).toEqual(order);
    expect(sameValues).not.toBe(order);
  });
});
