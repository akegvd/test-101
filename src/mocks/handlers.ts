import { delay, http, HttpResponse } from 'msw';
import { account, funds } from './data';

// delay() waits ~100-400ms in the browser (so you can see loading states)
// and only ~5ms in tests.
export const handlers = [
  http.get('/api/funds', async () => {
    await delay();
    return HttpResponse.json(funds);
  }),

  http.get('/api/funds/:id', async ({ params }) => {
    await delay();
    const fund = funds.find((f) => f.id === params.id);
    if (!fund) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json(fund);
  }),

  http.get('/api/account', async () => {
    await delay();
    return HttpResponse.json(account);
  }),
];
