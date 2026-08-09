import type { TradingJournalEntrySimplified } from './types/notion-type.ts';

export interface TradeStats {
  totalTrades: number;
  wins: number;
  losses: number;
  breakEven: number;
  /** Persen 0-100, dihitung dari trade yang menang/kalah saja (BE dikecualikan). */
  winRate: number;
  totalPnl: number;
  grossProfit: number;
  /** Selalu positif. */
  grossLoss: number;
  /** null kalau belum ada trade rugi (pembagi nol). */
  profitFactor: number | null;
  avgWin: number;
  avgLoss: number;
  /** Ekspektasi P&L per trade. */
  expectancy: number;
  bestTrade: number;
  worstTrade: number;
  startingBalance: number;
  currentBalance: number;
  /** Persen return terhadap saldo awal. */
  returnPct: number;
}

/** Dipakai kalau ACCOUNT_STARTING_BALANCE tidak diset. */
export const DEFAULT_STARTING_BALANCE = 10000;

export type Outcome = 'win' | 'loss' | 'breakEven';

export function outcomeOf(trade: TradingJournalEntrySimplified): Outcome {
  if (trade.isBreakEven) return 'breakEven';
  if (trade.profitLoss === null) return trade.isWin ? 'win' : 'loss';
  if (trade.profitLoss > 0) return 'win';
  if (trade.profitLoss < 0) return 'loss';
  return 'breakEven';
}

export function computeTradeStats(
  trades: TradingJournalEntrySimplified[],
  startingBalance: number = DEFAULT_STARTING_BALANCE,
): TradeStats {
  let wins = 0;
  let losses = 0;
  let breakEven = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let bestTrade = 0;
  let worstTrade = 0;

  for (const trade of trades) {
    const outcome = outcomeOf(trade);
    if (outcome === 'win') wins++;
    else if (outcome === 'loss') losses++;
    else breakEven++;

    const pnl = trade.profitLoss ?? 0;
    if (pnl > 0) grossProfit += pnl;
    else grossLoss += Math.abs(pnl);

    bestTrade = Math.max(bestTrade, pnl);
    worstTrade = Math.min(worstTrade, pnl);
  }

  const decided = wins + losses;
  const totalPnl = grossProfit - grossLoss;

  return {
    totalTrades: trades.length,
    wins,
    losses,
    breakEven,
    winRate: decided > 0 ? (wins / decided) * 100 : 0,
    totalPnl,
    grossProfit,
    grossLoss,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : null,
    avgWin: wins > 0 ? grossProfit / wins : 0,
    avgLoss: losses > 0 ? grossLoss / losses : 0,
    expectancy: trades.length > 0 ? totalPnl / trades.length : 0,
    bestTrade,
    worstTrade,
    startingBalance,
    currentBalance: startingBalance + totalPnl,
    returnPct: startingBalance > 0 ? (totalPnl / startingBalance) * 100 : 0,
  };
}
