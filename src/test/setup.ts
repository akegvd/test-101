import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/mocks/node';

// Every test file gets a fake API (MSW). A request with no handler fails the test.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers(); // remove server.use(...) overrides from the last test
});

afterAll(() => server.close());
