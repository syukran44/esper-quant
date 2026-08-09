import { Activity } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  formatMoneyExact,
  formatPercent,
  formatSignedMoneyExact,
} from '#/lib/format'
import type { DetailedStats, TradeStats } from '#/lib/types/trade'
import { cn } from '#/lib/utils'

type RowTone = 'neutral' | 'positive' | 'negative'

const rowTone: Record<RowTone, string> = {
  neutral: 'text-foreground',
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
}

interface Row {
  label: string
  value: ReactNode
  /** Konteks kecil di bawah nilai, mis. ukuran sampel. */
  hint?: string
  tone?: RowTone
}

function StatRow({ label, value, hint, tone = 'neutral' }: Row) {
  return (
    <div className="flex items-start justify-between gap-3.5 border-b px-5 py-2.5 last:border-b-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-right">
        <span
          className={cn('text-[13.5px] font-bold tabular-nums', rowTone[tone])}
        >
          {value}
        </span>
        {hint && (
          <span className="block text-[10.5px] font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
    </div>
  )
}

function signTone(value: number): RowTone {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}

/** Label gaya trading dari rata-rata lama posisi. */
function holdingStyle(minutes: number) {
  if (minutes < 60) return 'Scalping'
  if (minutes < 60 * 24) return 'Intraday'
  return 'Swing'
}

function formatHold(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = minutes / 60
  if (hours < 24) return `${hours.toFixed(1)} h`
  return `${(hours / 24).toFixed(1)} d`
}

interface DetailedStatsCardProps {
  stats?: TradeStats
  detailed?: DetailedStats
  isLoading?: boolean
}

export default function DetailedStatsCard({
  stats,
  detailed,
  isLoading = false,
}: DetailedStatsCardProps) {
  const winRate = stats?.winRate ?? 0
  const totalTrades = stats?.totalTrades ?? 0

  // Persen terhadap saldo awal — satu-satunya basis modal yang tersedia.
  const asPercentOfBalance = (value: number) =>
    stats && stats.startingBalance > 0
      ? formatPercent((value / stats.startingBalance) * 100)
      : null

  const withPercent = (value: number) => {
    const percent = asPercentOfBalance(value)
    return percent
      ? `${formatSignedMoneyExact(value)} · ${value > 0 ? '+' : ''}${percent}`
      : formatSignedMoneyExact(value)
  }

  const rrSampleHint = (sample: number) =>
    totalTrades > 0 ? `from ${sample} of ${totalTrades} trades` : undefined

  const leftRows: Array<Row> = [
    { label: 'Total Trades', value: totalTrades.toLocaleString('en-US') },
    {
      label: 'Profit Factor',
      value: stats?.profitFactor != null ? stats.profitFactor.toFixed(2) : '—',
    },
    {
      label: 'Avg. R:R',
      value:
        detailed?.avgPlannedRR != null ? detailed.avgPlannedRR.toFixed(2) : '—',
      hint: detailed ? rrSampleHint(detailed.plannedRRSample) : undefined,
    },
    {
      // Nilai utamanya rupiah karena mencakup seluruh trade. Ekspektasi dalam R
      // hanya bisa dihitung dari trade yang punya harga, jadi ditaruh di hint
      // bersama ukuran sampelnya — kalau digabung jadi satu angka, dua basis
      // yang berbeda terbaca seolah satu ukuran.
      label: 'Expectancy',
      value: formatSignedMoneyExact(stats?.expectancy ?? 0),
      hint:
        detailed?.expectancyR != null
          ? `${detailed.expectancyR > 0 ? '+' : ''}${detailed.expectancyR.toFixed(2)}R from ${detailed.realizedRSample} of ${totalTrades} trades`
          : undefined,
      tone: signTone(stats?.expectancy ?? 0),
    },
    {
      label: 'Recovery Factor',
      value:
        detailed?.recoveryFactor != null
          ? detailed.recoveryFactor.toFixed(2)
          : '—',
      hint:
        detailed && detailed.maxDrawdown > 0
          ? `max drawdown ${formatMoneyExact(detailed.maxDrawdown)}`
          : 'no drawdown yet',
    },
    {
      label: 'Avg. Win / Loss',
      value: `${formatSignedMoneyExact(stats?.avgWin ?? 0)} / ${formatSignedMoneyExact(-(stats?.avgLoss ?? 0))}`,
    },
    {
      label: 'Gross Profit',
      value: formatSignedMoneyExact(stats?.grossProfit ?? 0),
      tone: 'positive',
    },
    {
      label: 'Gross Loss',
      value: formatSignedMoneyExact(-(stats?.grossLoss ?? 0)),
      tone: 'negative',
    },
  ]

  const rightRows: Array<Row> = [
    {
      label: 'Longs Won',
      value: detailed
        ? `${formatPercent(detailed.longs.winRate, 0)} (${detailed.longs.total})`
        : '—',
    },
    {
      label: 'Shorts Won',
      value: detailed
        ? `${formatPercent(detailed.shorts.winRate, 0)} (${detailed.shorts.total})`
        : '—',
    },
    {
      label: 'Best Day',
      value: detailed ? withPercent(detailed.bestDayPnl) : '—',
      tone: signTone(detailed?.bestDayPnl ?? 0),
    },
    {
      label: 'Worst Day',
      value: detailed ? withPercent(detailed.worstDayPnl) : '—',
      tone: signTone(detailed?.worstDayPnl ?? 0),
    },
    {
      label: 'Max Win Streak',
      value: `${detailed?.maxWinStreak ?? 0}×`,
      tone: 'positive',
    },
    {
      label: 'Max Loss Streak',
      value: `${detailed?.maxLossStreak ?? 0}×`,
      tone: 'negative',
    },
    {
      label: 'Avg Hold',
      value:
        detailed?.avgHoldMinutes != null
          ? `${formatHold(detailed.avgHoldMinutes)} · ${holdingStyle(detailed.avgHoldMinutes)}`
          : '—',
    },
    {
      label: 'Avg Daily Gain',
      value: detailed ? withPercent(detailed.avgDailyPnl) : '—',
      hint: detailed ? `over ${detailed.tradingDays} trading days` : undefined,
      tone: signTone(detailed?.avgDailyPnl ?? 0),
    },
    { label: 'Pairs Traded', value: String(detailed?.pairsTraded ?? 0) },
  ]

  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-lg border bg-background shadow-sm">
        <header className="flex items-center gap-2.5 border-b p-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            <Activity />
          </span>
          <h2 className="text-base font-semibold text-foreground">
            Performance detail
          </h2>
        </header>
        <div className="space-y-3 p-5">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-4 w-full animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-lg border bg-background shadow-sm">
      <header className="flex items-center gap-2.5 border-b p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
          <Activity />
        </span>
        <h2 className="text-base font-semibold text-foreground">
          Performance detail
        </h2>
      </header>

      <div className="border-b px-5 py-4">
        <div className="mb-2 flex justify-between text-xs">
          <span className="font-semibold text-green-600 dark:text-green-400">
            Profitability · {formatPercent(winRate, 0)} wins
          </span>
          <span className="text-muted-foreground">
            {stats?.wins ?? 0} W / {stats?.losses ?? 0} L
          </span>
        </div>
        {/* Track merah = porsi kalah, isian hijau = porsi menang. */}
        <div className="flex h-2.5 overflow-hidden rounded-full bg-(--pnl-r3)">
          <div
            className="h-full bg-(--pnl-g4)"
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="md:border-r">
          {leftRows.map((row) => (
            <StatRow key={row.label} {...row} />
          ))}
        </div>
        <div>
          {rightRows.map((row) => (
            <StatRow key={row.label} {...row} />
          ))}
        </div>
      </div>
    </section>
  )
}
