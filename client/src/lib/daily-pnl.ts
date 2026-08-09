import type { Trade } from '#/lib/types/trade'

export interface DailyPnl {
  /** Format yyyy-MM-dd, sama dengan Trade.date dari Notion. */
  date: string
  pnl: number
  tradeCount: number
  wins: number
  losses: number
  trades: Array<Trade>
}

/**
 * Kelompokkan trade per tanggal. Key-nya string yyyy-MM-dd apa adanya dari
 * Notion, jadi tidak ada konversi timezone yang bisa menggeser hari.
 */
export function groupTradesByDay(trades: Array<Trade>): Map<string, DailyPnl> {
  const byDay = new Map<string, DailyPnl>()

  for (const trade of trades) {
    if (!trade.date) continue

    let day = byDay.get(trade.date)
    if (!day) {
      day = {
        date: trade.date,
        pnl: 0,
        tradeCount: 0,
        wins: 0,
        losses: 0,
        trades: [],
      }
      byDay.set(trade.date, day)
    }

    const pnl = trade.profitLoss ?? 0
    day.pnl += pnl
    day.tradeCount += 1
    if (!trade.isBreakEven) {
      if (pnl > 0) day.wins += 1
      else if (pnl < 0) day.losses += 1
    }
    day.trades.push(trade)
  }

  return byDay
}

export type PnlLevel = 1 | 2 | 3 | 4

/**
 * Intensitas warna 1-4, relatif terhadap hari terbesar di bulan yang sedang
 * ditampilkan — supaya skala heatmap selalu terpakai penuh berapa pun ukuran akun.
 */
export function pnlLevel(pnl: number, scale: number): PnlLevel {
  if (scale <= 0) return 1

  const ratio = Math.abs(pnl) / scale
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/** P&L absolut terbesar dari sekumpulan hari, dipakai sebagai skala heatmap. */
export function maxAbsPnl(days: Array<DailyPnl>): number {
  return days.reduce((max, day) => Math.max(max, Math.abs(day.pnl)), 0)
}
