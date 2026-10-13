import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '@/App';
import { server } from '@/mocks/node';
import { renderWithProviders } from '@/test/renderWithProviders';

function renderApp(route = '/') {
  const user = userEvent.setup();
  renderWithProviders(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  );
  return { user };
}

describe('Buy fund flow', () => {
  it('pick Fund A → enter 5000 → Buy → confirm page shows amount and fee', async () => {
    const { user } = renderApp('/');

    await user.click(await screen.findByRole('button', { name: 'Fund A' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount (THB)' }), '5000');
    await user.click(screen.getByRole('button', { name: 'Buy' }));

    expect(await screen.findByRole('heading', { name: 'Confirm order' })).toBeInTheDocument();
    expect(await screen.findByText('Fund: Fund A')).toBeInTheDocument();
    expect(screen.getByText('Amount: 5,000.00 THB')).toBeInTheDocument();
    expect(screen.getByText('Fee: 75.00 THB')).toBeInTheDocument();
    expect(screen.getByText('Units: 400.0000')).toBeInTheDocument();
  });

  it('VIP customer → confirm page shows fee 0.00', async () => {
    server.use(http.get('/api/account', () => HttpResponse.json({ balance: 50000, isVip: true })));
    const { user } = renderApp('/');

    await user.click(await screen.findByRole('button', { name: 'Fund A' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount (THB)' }), '5000');
    await user.click(screen.getByRole('button', { name: 'Buy' }));

    expect(await screen.findByText('Fee: 0.00 THB')).toBeInTheDocument();
  });

  it('amount above the balance → shows "Insufficient balance" and Buy is disabled', async () => {
    const { user } = renderApp('/');

    await user.click(await screen.findByRole('button', { name: 'Fund A' }));
    await user.type(screen.getByRole('textbox', { name: 'Amount (THB)' }), '60000');

    expect(screen.getByRole('alert')).toHaveTextContent('Insufficient balance');
    expect(screen.getByRole('button', { name: 'Buy' })).toBeDisabled();
  });

  it('open /confirm with no order → shows "No order to confirm"', () => {
    renderApp('/confirm');

    expect(screen.getByText('No order to confirm')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/');
  });

  it('open /confirm for a fund that does not exist → shows "Fund not found"', async () => {
    renderApp('/confirm?fundId=999&amount=5000');

    expect(await screen.findByText('Fund not found')).toBeInTheDocument();
  });

  it('fund list API fails → shows "Something went wrong"', async () => {
    server.use(http.get('/api/funds', () => new HttpResponse(null, { status: 500 })));

    renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
  });
});
