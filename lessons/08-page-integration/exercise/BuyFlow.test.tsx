import { describe, it } from 'vitest';

// TODO: test the whole buy flow like a user, across pages.
// Render the real routes inside a MemoryRouter, with providers:
//   renderWithProviders(
//     <MemoryRouter initialEntries={['/']}>
//       <AppRoutes />
//     </MemoryRouter>,
//   );
// You will need: MemoryRouter (react-router), AppRoutes (@/App), renderWithProviders (@/test/renderWithProviders)
describe('Buy fund flow', () => {
  it.todo('pick Fund A → enter 5000 → Buy → confirm page shows amount "5,000.00 THB" and fee "75.00 THB"');
  it.todo('VIP customer → confirm page shows fee "0.00 THB" (override /api/account with server.use)');
  it.todo('amount above the balance → shows "Insufficient balance" and Buy is disabled');
  it.todo('open /confirm with no order → shows "No order to confirm"');
  it.todo('fund list API fails → shows "Something went wrong"');
});
