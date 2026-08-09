import { outcomeOf } from './stats.ts';
import type { TradingJournalEntrySimplified } from './types/notion-type.ts';

export interface DirectionStats {
  total: number;
  wins: number;
  losses: number;
  /** Persen 0-100, BE dikecualikan dari pembagi. */
  winRate: number;
}

export interface DetailedStats {
  /** Rata-rata R:R rencana (|TP-entry| / |entry-SL|). null kalau tidak ada data harga. */
  avgPlannedRR: number | null;
  /** Berapa trade yang punya entry+SL+TP sehingga R:R rencananya bisa dihitung. */
  plannedRRSample: number;
  /** Rata-rata R yang benar-benar terealisasi dari exit price. */
  expectancyR: number | null;
  /** Berapa trade yang punya entry+SL+exit sehingga R realisasinya bisa dihitung. */
  realizedRSample: number;
  /** Selalu positif; 0 kalau equity tidak pernah turun dari puncaknya. */
  maxDrawdown: number;
  /** Net profit / max drawdown. null kalau belum pernah drawdown. */
  recoveryFactor: number | null;
  longs: DirectionStats;
  shorts: DirectionStats;
  bestDayPnl: number;
  worstDayPnl: number;
  tradingDays: number;
  avgDailyPnl: number;
  maxWinStreak: number;
  maxLossStreak: number;
  avgHoldMinutes: number | null;
  pairsTraded: number;
}

const EMPTY_DIRECTION: DirectionStats = {
  total: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
};

/**
 * Urutkan kronologis. Nomor pada kolom Name dipakai sebagai tiebreaker untuk
 * trade di hari yang sama, karena Notion tidak menyimpan jam entry — tanpa ini
 * urutan streak dan drawdown intraday jadi sembarang.
 */
function chronological(
  trades: TradingJournalEntrySimplified[],
): TradingJournalEntrySimplified[] {
  return [...trades].sort((a, b) => {
    const byDate = (a.date ?? '').localeCompare(b.date ?? '');
    if (byDate !== 0) return byDate;
    return (Number(a.name) || 0) - (Number(b.name) || 0);
  });
}

function directionStats(
  trades: TradingJournalEntrySimplified[],
  direction: 'LONG' | 'SHORT',
): DirectionStats {
  const subset = trades.filter((trade) => trade.direction === direction);
  let wins = 0;
  let losses = 0;

  for (const trade of subset) {
    const outcome = outcomeOf(trade);
    if (outcome === 'win') wins++;
    else if (outcome === 'loss') losses++;
  }

  const decided = wins + losses;
  return {
    total: subset.length,
    wins,
    losses,
    winRate: decided > 0 ? (wins / decided) * 100 : 0,
  };
}

/** Risiko per trade dalam satuan harga. null kalau entry/SL kosong atau SL = entry. */
function riskPerUnit(trade: TradingJournalEntrySimplified): number | null {
  if (trade.entryPrice === null || trade.slPrice === null) return null;
  const risk = Math.abs(trade.entryPrice - trade.slPrice);
  return risk > 0 ? risk : null;
}

export function computeDetailedStats(
  trades: TradingJournalEntrySimplified[],
): DetailedStats {
  if (trades.length === 0) {
    return {
      avgPlannedRR: null,
      plannedRRSample: 0,
      expectancyR: null,
      realizedRSample: 0,
      maxDrawdown: 0,
      recoveryFactor: null,
      longs: EMPTY_DIRECTION,
      shorts: EMPTY_DIRECTION,
      bestDayPnl: 0,
      worstDayPnl: 0,
      tradingDays: 0,
      avgDailyPnl: 0,
      maxWinStreak: 0,
      maxLossStreak: 0,
      avgHoldMinutes: null,
      pairsTraded: 0,
    };
  }

  const ordered = chronological(trades);

  // --- Metrik berbasis R (hanya trade yang punya harga lengkap) ---
  let plannedRRSum = 0;
  let plannedRRSample = 0;
  let realizedRSum = 0;
  let realizedRSample = 0;

  for (const trade of ordered) {
    const risk = riskPerUnit(trade);
    if (risk === null) continue;

    if (trade.tpPrice !== null) {
      plannedRRSum += Math.abs(trade.tpPrice - trade.entryPrice!) / risk;
      plannedRRSample++;
    }

    if (trade.exitPrice !== null && trade.direction !== null) {
      const move =
        trade.direction === 'LONG'
          ? trade.exitPrice - trade.entryPrice!
          : trade.entryPrice! - trade.exitPrice;
      realizedRSum += move / risk;
      realizedRSample++;
    }
  }

  // --- Drawdown & streak (kronologis) ---
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let winStreak = 0;
  let lossStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;

  for (const trade of ordered) {
    equity += trade.profitLoss ?? 0;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);

    // Break-even memutus kedua streak: bukan menang, bukan kalah.
    const outcome = outcomeOf(trade);
    if (outcome === 'win') {
      winStreak++;
      lossStreak = 0;
    } else if (outcome === 'loss') {
      lossStreak++;
      winStreak = 0;
    } else {
      winStreak = 0;
      lossStreak = 0;
    }
    maxWinStreak = Math.max(maxWinStreak, winStreak);
    maxLossStreak = Math.max(maxLossStreak, lossStreak);
  }

  // --- Agregat harian ---
  const pnlByDay = new Map<string, number>();
  for (const trade of ordered) {
    if (!trade.date) continue;
    pnlByDay.set(
      trade.date,
      (pnlByDay.get(trade.date) ?? 0) + (trade.profitLoss ?? 0),
    );
  }
  const dailyPnl = [...pnlByDay.values()];
  const totalPnl = dailyPnl.reduce((sum, pnl) => sum + pnl, 0);

  // --- Durasi & pair ---
  const durations = ordered
    .map((trade) => trade.durationMinutes)
    .filter((minutes): minutes is number => minutes !== null);
  const pairs = new Set(
    ordered
      .map((trade) => trade.pair)
      .filter((pair): pair is string => pair !== null),
  );

  return {
    avgPlannedRR: plannedRRSample > 0 ? plannedRRSum / plannedRRSample : null,
    plannedRRSample,
    expectancyR: realizedRSample > 0 ? realizedRSum / realizedRSample : null,
    realizedRSample,
    maxDrawdown,
    recoveryFactor: maxDrawdown > 0 ? totalPnl / maxDrawdown : null,
    longs: directionStats(ordered, 'LONG'),
    shorts: directionStats(ordered, 'SHORT'),
    bestDayPnl: dailyPnl.length > 0 ? Math.max(...dailyPnl) : 0,
    worstDayPnl: dailyPnl.length > 0 ? Math.min(...dailyPnl) : 0,
    tradingDays: dailyPnl.length,
    avgDailyPnl: dailyPnl.length > 0 ? totalPnl / dailyPnl.length : 0,
    maxWinStreak,
    maxLossStreak,
    avgHoldMinutes:
      durations.length > 0
        ? durations.reduce((sum, minutes) => sum + minutes, 0) /
          durations.length
        : null,
    pairsTraded: pairs.size,
  };
}
