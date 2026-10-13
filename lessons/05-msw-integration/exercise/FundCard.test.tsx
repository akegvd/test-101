import { describe, it } from 'vitest';

// TODO: render FundCard with renderWithProviders (src/test/renderWithProviders.tsx).
// The API is mocked by MSW (src/mocks/handlers.ts). Change it per test with server.use(...).
// You will need:
//   import { delay, http, HttpResponse } from 'msw';
//   import { server } from '@/mocks/node';
describe('FundCard', () => {
  it.todo('while loading → shows the skeleton (role "status", name "Loading fund")');
  it.todo('success → shows the fund name and NAV "NAV: 12.50"');
  it.todo('server error 500 → shows "Something went wrong"');
  it.todo('fund not found 404 → shows "Fund not found"');
});
