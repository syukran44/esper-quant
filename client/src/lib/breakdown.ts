import type { Trade } from '#/lib/types/trade'

export interface BreakdownRow {
  label: string
  trades: number
  wins: number
  losses: number
  breakEven: number
  /** Persen 0-100, BE dikecualikan dari pembagi — sama dengan stats global. */
  winRate: number
  pnl: number
}

/** Bucket untuk trade yang propertinya belum diisi di Notion. */
export const UNSPECIFIED_LABEL = 'Unspecified'

/**
 * Kelompokkan trade berdasarkan dimensi apa pun (model, session, pair, ...).
 * Trade dengan nilai kosong tetap dihitung di bucket "Unspecified" supaya
 * jumlah baris selalu menjumlah ke total trade, bukan diam-diam hilang.
 */
export function breakdownBy(
  trades: Array<Trade>,
  pick: (trade: Trade) => string | null,
): Array<BreakdownRow> {
  const rows = new Map<string, BreakdownRow>()

  for (const trade of trades) {
    const label = pick(trade) ?? UNSPECIFIED_LABEL

    let row = rows.get(label)
    if (!row) {
      row = {
        label,
        trades: 0,
        wins: 0,
        losses: 0,
        breakEven: 0,
        winRate: 0,
        pnl: 0,
      }
      rows.set(label, row)
    }

    const pnl = trade.profitLoss ?? 0
    row.trades += 1
    row.pnl += pnl

    if (trade.isBreakEven || pnl === 0) row.breakEven += 1
    else if (pnl > 0) row.wins += 1
    else row.losses += 1
  }

  for (const row of rows.values()) {
    const decided = row.wins + row.losses
    row.winRate = decided > 0 ? (row.wins / decided) * 100 : 0
  }

  return [...rows.values()].sort((a, b) => b.pnl - a.pnl)
}

/** Skala bar: P&L absolut terbesar antar baris. */
export function maxAbsRowPnl(rows: Array<BreakdownRow>): number {
  return rows.reduce((max, row) => Math.max(max, Math.abs(row.pnl)), 0)
}
