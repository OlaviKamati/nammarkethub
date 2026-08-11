// Display-only currency conversion. Shops still arrange real payment directly with
// buyers in N$ (or R, since the Rand is pegged 1:1 to the Namibian dollar) — this only
// changes how prices are *shown* while browsing, nothing about the actual transaction.
export const CURRENCIES = {
  NAD: { code: 'NAD', symbol: 'N$', rate: 1, label: 'N$ Namibian Dollar' },
  ZAR: { code: 'ZAR', symbol: 'R', rate: 1, label: 'R South African Rand (pegged 1:1)' },
  USD: { code: 'USD', symbol: '$', rate: 0.054, label: '$ US Dollar (approx.)' },
}

export function formatPrice(nadAmount, currencyCode = 'NAD') {
  const c = CURRENCIES[currencyCode] ?? CURRENCIES.NAD
  const converted = Number(nadAmount) * c.rate
  const decimals = c.rate === 1 ? 0 : 2
  return `${c.symbol}${converted.toLocaleString('en-NA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}
