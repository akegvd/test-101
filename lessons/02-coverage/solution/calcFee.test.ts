import { describe, expect, it } from 'vitest';
import { calcFee } from '@/utils/calcFee';

// ✅ Same 100% coverage as the weak test, but each test checks a real value.
// Change 0.015 to 0.15 → "normal customer pays 1.5%" fails. The bug is caught.
describe('calcFee', () => {
  it('normal customer pays 1.5% of the amount: 1000 → 15', () => {
    expect(calcFee(1000, false)).toBe(15);
  });

  it('rounds the fee to 2 decimals: 1234.56 → 18.52', () => {
    expect(calcFee(1234.56, false)).toBe(18.52); // 18.5184
  });

  it('VIP customer pays no fee', () => {
    expect(calcFee(1000, true)).toBe(0);
  });

  it.each([0, -100])('amount %s → throws "Amount must be greater than 0"', (amount) => {
    expect(() => calcFee(amount, false)).toThrow('Amount must be greater than 0');
  });

  // 100% coverage did not find these. They need a decision from the team, not just a test.
  // calcFee(NaN, false) → NaN (no error!)  ·  calcFee(0.01, false) → 0 (free?)
  it.todo('NaN amount → should it throw? (ask the team)');
  it.todo('very small amount 0.01 → fee rounds to 0. Is that OK? (ask the team)');
});
