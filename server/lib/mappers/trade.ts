import type {
  TradingJournalEntry,
  TradingJournalEntrySimplified,
} from '../types/notion-type.ts';

// Notion kadang tidak mengirim property yang belum pernah diisi, jadi setiap
// akses dibuat opsional supaya satu row rusak tidak menjatuhkan seluruh response.
type Props = Partial<TradingJournalEntry['properties']>;

export function toSimplifiedTrade(
  entry: TradingJournalEntry,
): TradingJournalEntrySimplified {
  const p = entry.properties as Props;

  const profitLoss = p['Profit/Loss']?.number ?? null;
  const isBreakEven = p.BE?.checkbox ?? false;

  return {
    id: entry.id,
    name: p.Name?.title.map((t) => t.plain_text).join('') ?? '',
    date: p.Date?.date?.start ?? null,
    year: p.Year?.formula.string ?? '',
    month: p.Month?.formula.string ?? '',
    dayOfWeek: p.DOW?.formula.string ?? '',
    pair: p.Pairs?.select?.name ?? null,
    direction:
      (p.Direction?.select?.name as 'LONG' | 'SHORT' | undefined) ?? null,
    session: p.Session?.select?.name ?? null,
    entryWindow: p['Entry Window']?.select?.name ?? null,
    modelUsed: p['Model Used']?.select?.name ?? null,
    actualModel: p['Actual Model']?.select?.name ?? null,
    marketRegime: p['Market Regime']?.select?.name ?? null,
    entryPrice: p['Entry Price']?.number ?? null,
    exitPrice: p['Exit Price']?.number ?? null,
    slPrice: p['SL Price']?.number ?? null,
    tpPrice: p['TP Price']?.number ?? null,
    maePrice: p['MAE Price']?.number ?? null,
    mfePrice: p['MFE Price']?.number ?? null,
    positionSizeLot: p['Position Size (lot)']?.number ?? null,
    durationMinutes: p['Duration in Minutes']?.number ?? null,
    profitLoss,
    isWin: p.WIN?.formula.boolean ?? (profitLoss !== null && profitLoss > 0),
    isBreakEven,
    followedRules: p['Followed rules']?.checkbox ?? false,
    rating: p['Rating(1-10)']?.number ?? null,
    overallEmotion: p['Overall emotion']?.select?.name ?? null,
    positiveTags: p['Positive tags']?.multi_select.map((o) => o.name) ?? [],
    negativeTags: p['Negative tags']?.multi_select.map((o) => o.name) ?? [],
    exitReason: p['Exit Reason']?.select?.name ?? null,
    account: p.Account?.multi_select.map((o) => o.name) ?? [],
  };
}
