import type { Account, Fund } from '@/types';

// Fake data only. Names are made up on purpose.
export const funds: Fund[] = [
  { id: '1', name: 'Fund A', nav: 12.5, minAmount: 1000 },
  { id: '2', name: 'Fund B', nav: 8.2345, minAmount: 500 },
  { id: '3', name: 'Fund C', nav: 25, minAmount: 1000 },
  { id: '4', name: 'Fund D', nav: 10.1, minAmount: 100 },
  { id: '5', name: 'Fund E', nav: 1530.75, minAmount: 5000 },
  { id: '6', name: 'Fund F', nav: 9.99, minAmount: 1000 },
  { id: '7', name: 'Fund G', nav: 14.2, minAmount: 500 },
];

export const account: Account = { balance: 50000, isVip: false };
