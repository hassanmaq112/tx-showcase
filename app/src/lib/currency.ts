// Money formatting + rounding helpers.

/** Round to 2 decimal places, avoiding float drift in sums. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
  let fmt = formatterCache.get(currency);
  if (!fmt) {
    try {
      fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency });
    } catch {
      // Invalid currency code — fall back to plain decimal with a prefix.
      fmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2 });
    }
    formatterCache.set(currency, fmt);
  }
  return fmt;
}

/** Format an amount in the given currency, e.g. formatMoney(12.5, 'USD') → "$12.50". */
export function formatMoney(value: number, currency: string): string {
  return getFormatter(currency).format(value);
}

/** Compact form for axis labels, e.g. 1234 → "$1.2K". */
export function formatMoneyCompact(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return formatMoney(value, currency);
  }
}

/** The currency symbol alone, for input adornments. */
export function currencySymbol(currency: string): string {
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).formatToParts(0);
    return parts.find((p) => p.type === 'currency')?.value ?? currency;
  } catch {
    return currency;
  }
}
