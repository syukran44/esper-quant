import { queryOptions } from '@tanstack/react-query'

import type { TradesResponse } from '#/lib/types/trade'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function fetchTrades(): Promise<TradesResponse> {
  const response = await fetch(`${API_URL}/trades`)

  if (!response.ok) {
    throw new Error(`Gagal memuat trades (HTTP ${response.status})`)
  }

  return response.json()
}

export const tradesQueryOptions = queryOptions({
  queryKey: ['trades'],
  queryFn: fetchTrades,
  staleTime: 5 * 60 * 1000,
})
