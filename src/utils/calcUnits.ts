// Floating point: 1004 / 12.5 * 10000 = 803199.9999999999, not 803200.
// A tiny nudge before Math.floor fixes that, without rounding real values up.
const FLOAT_ERROR = 1e-9;

/** Units you get for an amount: amount / NAV, rounded down to 4 decimals. */
export function calcUnits(amount: number, nav: number): number {
  if (Number.isNaN(nav) || nav <= 0) {
    throw new Error('NAV must be greater than 0');
  }
  if (Number.isNaN(amount) || amount < 0) {
    throw new Error('Amount must be 0 or more');
  }
  return Math.floor((amount / nav) * 10000 + FLOAT_ERROR) / 10000;
}
