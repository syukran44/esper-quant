const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 1120 -> "$1.1K", -240 -> "-$240" */
export function formatCurrency(value: number) {
  return `${value < 0 ? '-' : ''}$${compactNumber.format(Math.abs(value))}`
}

/** Selalu bertanda: 309 -> "+$309", -180 -> "-$180" */
export function formatSignedCurrency(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}$${compactNumber.format(Math.abs(value))}`
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`
}

/** 1 -> "1 trade", 2 -> "2 trades" */
export function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}
