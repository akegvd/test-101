import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LazyFundList } from '@/components/LazyFundList';
import { funds } from '@/mocks/data';

// jsdom has no IntersectionObserver, so we give it a fake one.
// The fake saves the callback, so the test can say "now the bottom is in view".
let notify: IntersectionObserverCallback = () => {};

class FakeIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    notify = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
}

function bottomComesIntoView(isIntersecting = true) {
  act(() => {
    notify([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
}

describe('LazyFundList', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('first render → shows only the first 3 funds', () => {
    render(<LazyFundList funds={funds} pageSize={3} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('status')).toHaveTextContent('Loading more...');
  });

  it('bottom comes into view → shows 3 more funds', () => {
    render(<LazyFundList funds={funds} pageSize={3} />);

    bottomComesIntoView();

    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByText('Fund F')).toBeInTheDocument();
  });

  it('bottom not in view → nothing changes', () => {
    render(<LazyFundList funds={funds} pageSize={3} />);

    bottomComesIntoView(false);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('all funds shown → "Loading more..." disappears', () => {
    render(<LazyFundList funds={funds} pageSize={3} />);

    bottomComesIntoView(); // 6
    bottomComesIntoView(); // 7 (all)

    expect(screen.getAllByRole('listitem')).toHaveLength(7);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
