import { describe, expect, it } from 'vitest';
import { calcSellAmount } from '@/utils/calcSellAmount';

describe('calcSellAmount', () => {
  it('held 30 days or more → units × NAV, no fee: 100 × 12.5 → 1250', () => {
    expect(calcSellAmount(100, 12.5, 30)).toBe(1250);
  });

  it('held less than 30 days → 0.5% fee: 100 × 12.5 → 1250 - 6.25 = 1243.75', () => {
    expect(calcSellAmount(100, 12.5, 29)).toBe(1243.75);
  });

  it('rounds the amount down, never up: 1.2345 × 8.2345 → 10.16, not 10.17', () => {
    expect(calcSellAmount(1.2345, 8.2345, 30)).toBe(10.16); // 10.1654...
  });

  it('rounds the fee down: 10.16 × 0.5% = 0.0508 → fee 0.05 → 10.11', () => {
    expect(calcSellAmount(1.2345, 8.2345, 0)).toBe(10.11);
  });

  it.each([0, -1, Number.NaN])('units %s → throws "Units must be greater than 0"', (units) => {
    expect(() => calcSellAmount(units, 12.5, 30)).toThrow('Units must be greater than 0');
  });

  it.each([0, -1, Number.NaN])('NAV %s → throws "NAV must be greater than 0"', (nav) => {
    expect(() => calcSellAmount(100, nav, 30)).toThrow('NAV must be greater than 0');
  });
});
