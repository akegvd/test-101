import { describe, expect, it } from 'vitest';
import { calcFee } from '@/utils/calcFee';
import { calcUnits } from '@/utils/calcUnits';
import { formatAmount } from '@/utils/formatAmount';
import { validateAmount } from '@/utils/validateAmount';

// Every bug in `npm run bug:plant` makes at least one test here fail.
// Most of them live at an edge: exactly the limit, empty-looking input, rounding.
const limits = { min: 1000, balance: 50000 };

describe('validateAmount', () => {
  it('amount exactly equal to the minimum is valid', () => {
    expect(validateAmount('1000', limits)).toBeNull();
  });

  it('amount exactly equal to the balance is valid', () => {
    expect(validateAmount('50000', limits)).toBeNull();
  });

  it('spaces only → "Please enter an amount"', () => {
    expect(validateAmount('   ', limits)).toBe('Please enter an amount');
  });
});

describe('calcFee', () => {
  it('rounds to the nearest cent, not down: 1234.56 → 18.52', () => {
    expect(calcFee(1234.56, false)).toBe(18.52); // 18.5184
  });
});

describe('calcUnits', () => {
  it('floating point trap: 1004 / 12.5 → 80.32, not 80.3199', () => {
    expect(calcUnits(1004, 12.5)).toBe(80.32);
  });
});

describe('formatAmount', () => {
  it('NaN → "-"', () => {
    expect(formatAmount(Number.NaN)).toBe('-');
  });
});
