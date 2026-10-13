import { describe, it } from 'vitest';

// TODO: test the same search through the component, like a user.
// Real timers are fine here: findBy / waitFor wait up to 1 second.
describe('FundList', () => {
  it.todo('typing "Fund B" → only Fund B is listed');
  it.todo('no match → shows "No funds found"');
  it.todo('click a fund → calls onSelect with that fund');
});
