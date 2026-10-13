import { describe, expect, it } from 'vitest';
import { calcUnits } from '@/utils/calcUnits';

// Weak start: 100% line coverage, many surviving mutants.
describe('calcUnits', () => {
  it('returns some units', () => {
    expect(calcUnits(1000, 10)).toBeGreaterThan(0);
  });

  it('throws for a bad NAV', () => {
    expect(() => calcUnits(1000, 0)).toThrow();
    expect(() => calcUnits(-1, 10)).toThrow();
  });

  it.todo('exact value: 1000 / 10 → 100');
  it.todo('rounds down: 200 / 3 → 66.6666');
  it.todo('amount 0 → 0 (boundary of "amount < 0")');
  it.todo('NaN NAV and NaN amount → throw with the exact messages');
});
