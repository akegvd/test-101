import type { Account } from '@/types';

export async function getAccount(): Promise<Account> {
  const res = await fetch('/api/account');
  if (!res.ok) {
    throw new Error(`Failed to load account (${res.status})`);
  }
  return res.json() as Promise<Account>;
}
