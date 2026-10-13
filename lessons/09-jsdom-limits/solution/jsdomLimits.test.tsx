import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// These tests do not test our app. They show what jsdom (not a real browser) cannot do.
describe('jsdom limits', () => {
  it('no layout: every element has size 0 × 0', () => {
    render(<div style={{ width: 300, height: 100 }}>Box</div>);

    const rect = screen.getByText('Box').getBoundingClientRect();

    expect(rect.width).toBe(0);
    expect(rect.height).toBe(0);
  });

  it('no IntersectionObserver, ResizeObserver or matchMedia', () => {
    expect(globalThis.IntersectionObserver).toBeUndefined();
    expect(globalThis.ResizeObserver).toBeUndefined();
    expect(window.matchMedia).toBeUndefined();
  });

  it('CSS from .css files is not applied: a hidden class still counts as visible', () => {
    render(<p className="hidden-by-css">Secret</p>);

    expect(screen.getByText('Secret')).toBeVisible();
  });
});
