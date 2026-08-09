// Bentuk data yang dikirim server (hasil flatten dari page Notion).
// Harus sejalan dengan server/lib/types/notion-type.ts & server/lib/stats.ts.

export interface Trade {
  id: string
  name: string
  date: string | null
  year: string
  month: string
  dayOfWeek: string
  pair: string | null
  direction: 'LONG' | 'SHORT' | null
  session: string | null
  entryWindow: string | null
  modelUsed: string | null
  actualModel: string | null
  marketRegime: string | null
  entryPrice: number | null
  exitPrice: number | null
  slPrice: number | null
  tpPrice: number | null
  maePrice: number | null
  mfePrice: number | null
  positionSizeLot: number | null
  durationMinutes: number | null
  profitLoss: number | null
  isWin: boolean
  isBreakEven: boolean
  followedRules: boolean
  rating: number | null
  overallEmotion: string | null
  positiveTags: Array<string>
  negativeTags: Array<string>
  exitReason: string | null
  account: Array<string>
}

export interface TradeStats {
  totalTrades: number
  wins: number
  losses: number
  breakEven: number
  /** Persen 0-100, BE dikecualikan dari pembagi. */
  winRate: number
  totalPnl: number
  grossProfit: number
  grossLoss: number
  /** null kalau belum ada trade rugi. */
  profitFactor: number | null
  avgWin: number
  avgLoss: number
  expectancy: number
  bestTrade: number
  worstTrade: number
  startingBalance: number
  currentBalance: number
  /** Persen return terhadap saldo awal. */
  returnPct: number
}

export interface TradesResponse {
  trades: Array<Trade>
  stats: TradeStats
}
