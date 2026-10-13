import { describe, it } from 'vitest';

// Step 1: render <LazyFundList funds={funds} pageSize={3} /> with no mock.
//         Read the error. jsdom has no IntersectionObserver.
// Step 2: replace IntersectionObserver with a fake one (vi.stubGlobal) that saves the callback.
// Step 3: call the saved callback inside act() to "scroll to the bottom".
// You will need: funds from '@/mocks/data' (7 funds: Fund A … Fund G)
describe('LazyFundList', () => {
  it.todo('first render → shows only the first 3 funds');
  it.todo('bottom comes into view → shows 3 more funds');
  it.todo('bottom not in view → nothing changes');
  it.todo('all funds shown → "Loading more..." disappears');
});
