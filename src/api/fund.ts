import type { Fund } from '@/types';

export async function getFunds(): Promise<Fund[]> {
  const res = await fetch('/api/funds');
  if (!res.ok) {
    throw new Error(`Failed to load funds (${res.status})`);
  }
  return res.json() as Promise<Fund[]>;
}

/** Returns null when the fund does not exist (404). */
export async function getFund(id: string): Promise<Fund | null> {
  const res = await fetch(`/api/funds/${id}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to load fund ${id} (${res.status})`);
  }
  return res.json() as Promise<Fund>;
}
