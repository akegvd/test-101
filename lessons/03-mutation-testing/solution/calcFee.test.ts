import { describe, expect, it } from 'vitest';
import { calcFee } from '@/utils/calcFee';

describe('calcFee', () => {
  it('normal customer pays 1.5% of the amount: 1000 → 15', () => {
    expect(calcFee(1000, false)).toBe(15);
  });

  it('rounds the fee to 2 decimals: 1234.56 → 18.52', () => {
    expect(calcFee(1234.56, false)).toBe(18.52);
  });

  it('VIP customer pays no fee', () => {
    expect(calcFee(1000, true)).toBe(0);
  });

  it('smallest valid amount 0.01 → no error', () => {
    expect(() => calcFee(0.01, false)).not.toThrow();
  });

  it.each([0, -100])('amount %s → throws "Amount must be greater than 0"', (amount) => {
    expect(() => calcFee(amount, false)).toThrow('Amount must be greater than 0');
  });
});
