import { ArrowDownUp, CircleDollarSign, Percent, Target } from 'lucide-react'

import StatCard, { type StatTone } from './stat-card'

import { formatCurrency, formatPercent } from '#/lib/format'
import type { TradeStats } from '#/lib/types/trade'

interface TradeStatsCardsProps {
  stats?: TradeStats
  isLoading?: boolean
}

export default function TradeStatsCards({
  stats,
  isLoading = false,
}: TradeStatsCardsProps) {
  const totalPnl = stats?.totalPnl ?? 0
  const returnPct = stats?.returnPct ?? 0
  const profitFactor = stats?.profitFactor ?? null

  const pnlTone: StatTone =
    totalPnl > 0 ? 'positive' : totalPnl < 0 ? 'negative' : 'neutral'

  // profitFactor null artinya belum ada trade rugi, jadi dihitung sebagai bagus.
  const profitFactorTone: StatTone =
    profitFactor === null
      ? stats && stats.grossProfit > 0
        ? 'positive'
        : 'neutral'
      : profitFactor >= 1
        ? 'positive'
        : 'negative'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 lg:gap-4">
      <StatCard
        label="Win Rate"
        value={formatPercent(stats?.winRate ?? 0)}
        hint={
          stats &&
          `${stats.wins}W / ${stats.losses}L · ${stats.totalTrades} trade`
        }
        icon={<Target />}
        isLoading={isLoading}
      />
      <StatCard
        label="Total P&L"
        value={formatCurrency(totalPnl)}
        hint={stats && `${formatCurrency(stats.expectancy)} per trade`}
        icon={<CircleDollarSign />}
        tone={pnlTone}
        isLoading={isLoading}
      />
      <StatCard
        label="Returns"
        value={formatPercent(returnPct)}
        hint={
          stats &&
          `${formatCurrency(stats.startingBalance)} → ${formatCurrency(
            stats.currentBalance,
          )}`
        }
        icon={<Percent />}
        tone={pnlTone}
        isLoading={isLoading}
      />
      <StatCard
        label="Profit Factor"
        value={
          profitFactor === null
            ? stats && stats.grossProfit > 0
              ? '∞'
              : '—'
            : profitFactor.toFixed(2)
        }
        hint={
          stats &&
          `${formatCurrency(stats.grossProfit)} profit / ${formatCurrency(
            stats.grossLoss,
          )} loss`
        }
        icon={<ArrowDownUp />}
        tone={profitFactorTone}
        isLoading={isLoading}
      />
    </div>
  )
}
