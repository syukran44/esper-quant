import type { ReactNode } from 'react'

import type { BreakdownRow } from '#/lib/breakdown'
import { maxAbsRowPnl } from '#/lib/breakdown'
import { formatPercent, formatSignedCurrency, pluralize } from '#/lib/format'
import { cn } from '#/lib/utils'

// Bar terpendek tetap terlihat, biar baris kecil tidak tampak kosong.
const MIN_BAR_WIDTH = 4

interface BreakdownCardProps {
  title: string
  icon: ReactNode
  rows: Array<BreakdownRow>
  isLoading?: boolean
  emptyLabel?: string
}

export default function BreakdownCard({
  title,
  icon,
  rows,
  isLoading = false,
  emptyLabel = 'No trades yet',
}: BreakdownCardProps) {
  const scale = maxAbsRowPnl(rows)

  return (
    <section className="rounded-lg border bg-background shadow-sm">
      <header className="flex items-center gap-2.5 border-b p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </header>

      <div className="p-4">
        {isLoading ? (
          <ul className="space-y-4">
            {[0, 1, 2].map((index) => (
              <li key={index} className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
              </li>
            ))}
          </ul>
        ) : rows.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="space-y-4">
            {rows.map((row) => {
              const width =
                scale > 0
                  ? Math.max((Math.abs(row.pnl) / scale) * 100, MIN_BAR_WIDTH)
                  : MIN_BAR_WIDTH

              return (
                <li key={row.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-medium text-foreground">
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        'shrink-0 text-sm font-semibold tabular-nums',
                        row.pnl > 0 && 'text-green-600 dark:text-green-400',
                        row.pnl < 0 && 'text-red-600 dark:text-red-400',
                        row.pnl === 0 && 'text-muted-foreground',
                      )}
                    >
                      {formatSignedCurrency(row.pnl)}
                    </span>
                  </div>

                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        row.pnl < 0 ? 'bg-(--pnl-r4)' : 'bg-(--pnl-g4)',
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {pluralize(row.trades, 'trade')} · {row.wins}W /{' '}
                      {row.losses}L
                    </span>
                    <span>{formatPercent(row.winRate, 0)} win rate</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
