import { describe, it } from 'vitest';

// TODO: rewrite flaky.bad.test.tsx so each test is stable.
// No sleeps, every async query awaited, no state shared between tests.
describe('FundCard', () => {
  it.todo('shows the fund name');
  it.todo('shows the NAV');
});

describe('useFundSearch', () => {
  it.todo('empty query → returns all 7 funds');
  it.todo('a new fund shows up in the results');
});
