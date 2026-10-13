import { describe, expect, it } from 'vitest';
import { calcFee } from '@/utils/calcFee';

// ⚠️ WEAK TEST (on purpose). Coverage = 100%, but it checks almost nothing.
// Try: change 0.015 to 0.15 in src/utils/calcFee.ts. This test still passes.
describe('calcFee', () => {
  it('runs every line', () => {
    expect(calcFee(1000, false)).toBeDefined();
    expect(calcFee(1000, true)).toBeDefined();
    expect(() => calcFee(0, false)).toThrow();
  });
});
