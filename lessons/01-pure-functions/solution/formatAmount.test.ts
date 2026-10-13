import { describe, expect, it } from 'vitest';
import { formatAmount } from '@/utils/formatAmount';

// ✅ Fixed version of ../exercise/formatAmount.bad.test.ts
describe('formatAmount', () => {
  it.each([
    { value: 1000, expected: '1,000.00' },
    { value: 1234567, expected: '1,234,567.00' },
  ])('adds a comma every 3 digits: $value → "$expected"', ({ value, expected }) => {
    expect(formatAmount(value)).toBe(expected);
  });

  it.each([
    { value: 5, expected: '5.00' },
    { value: 1234.5, expected: '1,234.50' },
  ])('always shows 2 decimals: $value → "$expected"', ({ value, expected }) => {
    expect(formatAmount(value)).toBe(expected);
  });

  it('rounds long decimals to 2 places: 1.239 → "1.24"', () => {
    // Arrange
    const value = 1.239;

    // Act
    const result = formatAmount(value);

    // Assert
    expect(result).toBe('1.24');
  });

  it.each([
    { value: 0, expected: '0.00' },
    { value: -1234.5, expected: '-1,234.50' },
    { value: 1_000_000_000_000, expected: '1,000,000,000,000.00' },
  ])('edge case: $value → "$expected"', ({ value, expected }) => {
    expect(formatAmount(value)).toBe(expected);
  });

  it.each([
    { value: null, expected: '-' },
    { value: NaN, expected: '-' },
  ])('no value: $value → "$expected"', ({ value, expected }) => {
    expect(formatAmount(value)).toBe(expected);
  });
});
