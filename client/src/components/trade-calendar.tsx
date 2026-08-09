'use client'

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '#/components/ui/button'
import type { DailyPnl } from '#/lib/daily-pnl'
import { groupTradesByDay, maxAbsPnl, pnlLevel } from '#/lib/daily-pnl'
import { formatSignedCurrency, pluralize } from '#/lib/format'
import type { Trade } from '#/lib/types/trade'
import { cn } from '#/lib/utils'

// Minggu dimulai hari Senin, mengikuti kebiasaan jurnal trading.
const WEEK_STARTS_ON = 1 as const

const WEEKDAYS = [
  { short: 'M', full: 'Monday' },
  { short: 'T', full: 'Tuesday' },
  { short: 'W', full: 'Wednesday' },
  { short: 'T', full: 'Thursday' },
  { short: 'F', full: 'Friday' },
  { short: 'S', full: 'Saturday' },
  { short: 'S', full: 'Sunday' },
]

function levelClass(pnl: number, scale: number) {
  if (pnl === 0) return 'pnl-flat'
  return `pnl-${pnl > 0 ? 'g' : 'r'}${pnlLevel(pnl, scale)}`
}

interface TradeCalendarProps {
  trades?: Array<Trade>
  isLoading?: boolean
  /** Dipanggil saat sel hari yang ada tradenya diklik. */
  onSelectDay?: (day: DailyPnl) => void
}

export default function TradeCalendar({
  trades = [],
  isLoading = false,
  onSelectDay,
}: TradeCalendarProps) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))

  const byDay = useMemo(() => groupTradesByDay(trades), [trades])

  const gridDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), {
          weekStartsOn: WEEK_STARTS_ON,
        }),
        end: endOfWeek(endOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
      }),
    [month],
  )

  // Cocokkan lewat prefix "yyyy-MM" supaya tidak ada parsing tanggal
  // yang bisa menggeser hari karena timezone.
  const monthDays = useMemo(() => {
    const prefix = format(month, 'yyyy-MM')
    return [...byDay.values()].filter((day) => day.date.startsWith(prefix))
  }, [byDay, month])

  const scale = maxAbsPnl(monthDays)
  const monthPnl = monthDays.reduce((sum, day) => sum + day.pnl, 0)
  const monthTrades = monthDays.reduce((sum, day) => sum + day.tradeCount, 0)

  return (
    <section className="rounded-lg border bg-background shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Daily P&amp;L Heatmap
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {pluralize(monthDays.length, 'trading day')} ·{' '}
            {pluralize(monthTrades, 'trade')} ·{' '}
            <span
              className={cn(
                'font-medium',
                monthPnl > 0 && 'text-green-600 dark:text-green-400',
                monthPnl < 0 && 'text-red-600 dark:text-red-400',
              )}
            >
              {formatSignedCurrency(monthPnl)}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Loss</span>
            <span className="h-3 w-3 rounded-[3px] bg-(--pnl-r3)" />
            <span className="h-3 w-3 rounded-[3px] bg-(--pnl-r1)" />
            <span className="h-3 w-3 rounded-[3px] bg-(--pnl-g1)" />
            <span className="h-3 w-3 rounded-[3px] bg-(--pnl-g4)" />
            <span>Profit</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous month"
              onClick={() => setMonth(subMonths(month, 1))}
            >
              <ChevronLeft />
            </Button>
            <span className="min-w-32 text-center text-sm font-medium">
              {format(month, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next month"
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMonth(startOfMonth(new Date()))}
            >
              Today
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-7 p-4">
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={index}
            className="pb-1 text-center text-xs font-medium text-muted-foreground"
          >
            <span aria-hidden="true">{weekday.short}</span>
            <span className="sr-only">{weekday.full}</span>
          </div>
        ))}

        {gridDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd')

          if (!isSameMonth(day, month)) {
            return (
              <div
                key={key}
                className="min-h-16 m-0.5 rounded-lg sm:min-h-28"
              />
            )
          }

          const data = byDay.get(key)
          const interactive = Boolean(data && onSelectDay)

          const className = cn(
            'flex min-h-16 flex-col justify-between m-0.5 rounded-lg border-[0.7px] p-1.5 text-left transition-colors sm:min-h-28 sm:p-2',
            isLoading && 'animate-pulse bg-muted',
            !isLoading &&
              (data ? levelClass(data.pnl, scale) : 'bg-background'),
            isToday(day) &&
              'ring-2 ring-ring ring-offset-1 ring-offset-background',
            interactive &&
              'cursor-pointer hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:brightness-125',
          )

          const content = (
            <>
              <span className="text-xs font-medium opacity-80">
                {format(day, 'd')}
              </span>
              {data && !isLoading && (
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">
                    {formatSignedCurrency(data.pnl)}
                  </span>
                  <span className="block text-[10px] opacity-70">
                    {pluralize(data.tradeCount, 'trade')}
                  </span>
                </span>
              )}
            </>
          )

          if (!interactive) {
            return (
              <div key={key} className={className}>
                {content}
              </div>
            )
          }

          return (
            <button
              key={key}
              type="button"
              className={className}
              aria-label={`${format(day, 'd MMMM yyyy')}, P&L ${formatSignedCurrency(
                data!.pnl,
              )}, ${pluralize(data!.tradeCount, 'trade')}`}
              onClick={() => onSelectDay?.(data!)}
            >
              {content}
            </button>
          )
        })}
      </div>
    </section>
  )
}
