import { describe, expect, it } from 'vitest';
import { calcUnits } from '@/utils/calcUnits';

describe('calcUnits', () => {
  it('divides the amount by NAV: 1000 / 10 → 100', () => {
    expect(calcUnits(1000, 10)).toBe(100);
  });

  it('rounds down to 4 decimals, never up: 200 / 3 → 66.6666', () => {
    expect(calcUnits(200, 3)).toBe(66.6666);
  });

  it('exact result is not lowered by float error: 1004 / 12.5 → 80.32', () => {
    expect(calcUnits(1004, 12.5)).toBe(80.32);
  });

  it('amount 0 → 0 units', () => {
    expect(calcUnits(0, 10)).toBe(0);
  });

  it.each([0, -5, NaN])('NAV %s → throws "NAV must be greater than 0"', (nav) => {
    expect(() => calcUnits(1000, nav)).toThrow('NAV must be greater than 0');
  });

  it.each([-1, NaN])('amount %s → throws "Amount must be 0 or more"', (amount) => {
    expect(() => calcUnits(amount, 10)).toThrow('Amount must be 0 or more');
  });
});
