const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1234.5 → "1,234.50", null or NaN → "-" */
export function formatAmount(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return '-';
  }
  return formatter.format(value);
}
