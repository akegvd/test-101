import { describe, expect, it } from 'vitest';
import { calcFee } from '@/utils/calcFee';

// Start: the weak test from lesson 02. Run `npm run test:mutation:exercise`
// and look at the surviving mutants. Then replace the todos with tests that kill them.
describe('calcFee', () => {
  it('runs every line', () => {
    expect(calcFee(1000, false)).toBeDefined();
    expect(calcFee(1000, true)).toBeDefined();
    expect(() => calcFee(0, false)).toThrow();
  });

  it.todo('normal customer pays 1.5% (kills the "* → /" and rate mutants)');
  it.todo('rounds to 2 decimals');
  it.todo('VIP customer pays 0');
  it.todo('amount 0 → throws with the exact message (kills the empty-message mutant)');
});
