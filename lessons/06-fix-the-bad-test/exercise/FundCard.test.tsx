import { describe, it } from 'vitest';

// TODO: rewrite FundCard.bad.test.tsx here.
// Rules: no vi.mock, mock only the network (MSW), query by role / text, one behavior per test.
describe('FundCard', () => {
  it.todo('while loading → shows the skeleton');
  it.todo('success → shows the fund name and formatted NAV');
  it.todo('server error → shows "Something went wrong"');
  it.todo('fund does not exist → shows "Fund not found"');
});
