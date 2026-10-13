import { describe, expect, it } from 'vitest';
import { validateAmount } from '@/utils/validateAmount';

// This file does NOT cover every branch of validateAmount.
// 1. Run: npm run coverage -- lessons/02-coverage/exercise
// 2. Open coverage/index.html → src/utils/validateAmount.ts
// 3. Find the red / yellow lines. Decide: worth a test? Then add it below.
describe('validateAmount', () => {
  const limits = { min: 1000, balance: 50000 };

  it('amount between min and balance → null', () => {
    expect(validateAmount('5000', limits)).toBeNull();
  });

  it('amount below the minimum → "Minimum amount is 1,000.00"', () => {
    expect(validateAmount('500', limits)).toBe('Minimum amount is 1,000.00');
  });
});
