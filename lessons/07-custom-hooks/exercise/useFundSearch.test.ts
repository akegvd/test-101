import { describe, it } from 'vitest';

// TODO: test the hook alone with renderHook + act + fake timers.
// You will need:
//   import { act, renderHook } from '@testing-library/react';
//   import { afterEach, beforeEach, expect, vi } from 'vitest';
//   import { useFundSearch } from '@/hooks/useFundSearch';
describe('useFundSearch', () => {
  it.todo('empty query → returns all funds');
  it.todo('does not filter before 300ms');
  it.todo('filters by name after 300ms');
  it.todo('ignores upper / lower case');
  it.todo('typing again restarts the 300ms wait');
  it.todo('no match → empty list');
});
