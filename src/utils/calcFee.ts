const FEE_RATE = 0.015;

/** Buy fee: VIP pays 0, others pay 1.5% (rounded to 2 decimals). */
export function calcFee(amount: number, isVip: boolean): number {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (isVip) {
    return 0;
  }
  return Math.round(amount * FEE_RATE * 100) / 100;
}
