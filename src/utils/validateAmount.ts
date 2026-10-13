import { formatAmount } from './formatAmount';

type Limits = {
  min: number;
  balance: number;
};

/** Returns an error message, or null when the amount is valid. */
export function validateAmount(input: string, { min, balance }: Limits): string | null {
  const text = input.trim();
  if (text === '') {
    return 'Please enter an amount';
  }
  const amount = Number(text);
  if (Number.isNaN(amount)) {
    return 'Please enter a number';
  }
  if (amount < min) {
    return `Minimum amount is ${formatAmount(min)}`;
  }
  if (amount > balance) {
    return 'Insufficient balance';
  }
  return null;
}
