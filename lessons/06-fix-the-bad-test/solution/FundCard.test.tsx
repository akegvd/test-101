import { screen } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { FundCard } from '@/components/FundCard';
import { server } from '@/mocks/node';
import { renderWithProviders } from '@/test/renderWithProviders';

// ✅ Rewrite of ../exercise/FundCard.bad.test.tsx
// FundCard → useFund → api/getFund → GET /api/funds/:id → MSW
// We render the real component, hook and fetch. Only the network is fake.
describe('FundCard', () => {
  it('while loading → shows the skeleton', () => {
    server.use(
      http.get('/api/funds/:id', async () => {
        await delay('infinite'); // the response never comes
      }),
    );

    renderWithProviders(<FundCard fundId="1" />);

    expect(screen.getByRole('status', { name: 'Loading fund' })).toBeInTheDocument();
  });

  it('success → shows the fund name and formatted NAV', async () => {
    renderWithProviders(<FundCard fundId="1" />);

    expect(await screen.findByRole('heading', { name: 'Fund A' })).toBeInTheDocument();
    expect(screen.getByText('NAV: 12.50')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('server error 500 → shows "Something went wrong"', async () => {
    server.use(http.get('/api/funds/:id', () => new HttpResponse(null, { status: 500 })));

    renderWithProviders(<FundCard fundId="1" />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('fund not found 404 → shows "Fund not found"', async () => {
    server.use(http.get('/api/funds/:id', () => HttpResponse.json({ message: 'Not found' }, { status: 404 })));

    renderWithProviders(<FundCard fundId="999" />);

    expect(await screen.findByText('Fund not found')).toBeInTheDocument();
  });
});
