import { describe, expect, it } from 'vitest';
import { calcUnits } from '@/utils/calcUnits';

describe('calcUnits', () => {
  it('divides the amount by NAV: 1000 / 10 → 100', () => {
    // Arrange
    const amount = 1000;
    const nav = 10;

    // Act
    const units = calcUnits(amount, nav);

    // Assert
    expect(units).toBe(100);
  });

  it.each([
    { amount: 200, nav: 3, expected: 66.6666 }, // 66.66666... → 66.6666, not 66.6667
    { amount: 100, nav: 3, expected: 33.3333 },
  ])('rounds down to 4 decimals: $amount / $nav → $expected', ({ amount, nav, expected }) => {
    expect(calcUnits(amount, nav)).toBe(expected);
  });

  it.each([
    { amount: 0, nav: 10, expected: 0 },
    { amount: 1000, nav: 8.2345, expected: 121.4402 },
    { amount: 1_000_000_000, nav: 12.5, expected: 80_000_000 },
    { amount: 1004, nav: 12.5, expected: 80.32 }, // floating point gives 80.3199 if not handled
  ])('edge case: $amount / $nav → $expected', ({ amount, nav, expected }) => {
    expect(calcUnits(amount, nav)).toBe(expected);
  });

  it.each([0, -5, NaN])('NAV %s → throws "NAV must be greater than 0"', (nav) => {
    expect(() => calcUnits(1000, nav)).toThrow('NAV must be greater than 0');
  });

  it.each([-1, NaN])('amount %s → throws "Amount must be 0 or more"', (amount) => {
    expect(() => calcUnits(amount, 10)).toThrow('Amount must be 0 or more');
  });
});
