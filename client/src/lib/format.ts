const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 1120 -> "$1.1K", -240 -> "-$240" */
export function formatCurrency(value: number) {
  return `${value < 0 ? '-' : ''}$${compactNumber.format(Math.abs(value))}`
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`
}
