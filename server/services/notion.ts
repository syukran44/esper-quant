import { Client } from '@notionhq/client';

import {
  computeDetailedStats,
  type DetailedStats,
} from '../lib/detailed-stats.ts';
import { toSimplifiedTrade } from '../lib/mappers/trade.ts';
import {
  computeTradeStats,
  DEFAULT_STARTING_BALANCE,
  type TradeStats,
} from '../lib/stats.ts';
import type {
  TradingJournalEntry,
  TradingJournalEntrySimplified,
} from '../lib/types/notion-type.ts';

const notion = new Client({
  auth: process.env.NOTION_ESPER_TOKEN || '',
});

export interface TradesResponse {
  trades: TradingJournalEntrySimplified[];
  stats: TradeStats;
  detailed: DetailedStats;
}

export async function getTrades(): Promise<TradesResponse> {
  const pages: TradingJournalEntry[] = [];
  let cursor: string | null = null;

  do {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID!,
      start_cursor: cursor,
      page_size: 100,
    });

    // Hasil query bisa berisi partial page (tanpa properties) kalau integrasi
    // tidak punya akses penuh, jadi disaring dulu sebelum di-map.
    pages.push(
      ...(response.results.filter(
        (page) => 'properties' in page,
      ) as unknown as TradingJournalEntry[]),
    );
    cursor = response.next_cursor;
  } while (cursor);

  const trades = pages
    .map(toSimplifiedTrade)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const startingBalance =
    Number(process.env.ACCOUNT_STARTING_BALANCE) || DEFAULT_STARTING_BALANCE;

  return {
    trades,
    stats: computeTradeStats(trades, startingBalance),
    detailed: computeDetailedStats(trades),
  };
}
