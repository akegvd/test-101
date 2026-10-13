const SELL_FEE_RATE = 0.005;
export const SHORT_HOLD_DAYS = 30;

/**
 * Money you get when selling units: units × NAV, rounded down to 2 decimals.
 * Units held less than 30 days pay a 0.5% fee (rounded down to 2 decimals too).
 */
export function calcSellAmount(units: number, nav: number, daysHeld: number): number {
  if (Number.isNaN(units) || units <= 0) {
    throw new Error('Units must be greater than 0');
  }
  if (Number.isNaN(nav) || nav <= 0) {
    throw new Error('NAV must be greater than 0');
  }
  const gross = Math.floor(units * nav * 100) / 100;
  const fee = daysHeld < SHORT_HOLD_DAYS ? Math.floor(gross * SELL_FEE_RATE * 100) / 100 : 0;
  return Math.round((gross - fee) * 100) / 100;
}
