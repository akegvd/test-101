import { expect, test } from 'vitest';
import { formatAmount } from '@/utils/formatAmount';

// ❌ BAD EXAMPLE (on purpose). It passes, but it is not a useful test.
// Step 1 of the exercise: list what is wrong with it.
test('formatAmount works', () => {
  const values = [0, 1000, 1234.5, -50];
  for (const value of values) {
    const expected = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    expect(formatAmount(value)).toBe(expected);
  }
});
