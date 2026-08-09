import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import TradeStatsCards from '#/components/dashboard/trade-stats-cards'
import TradeCalendar from '#/components/trade-calendar'
import { tradesQueryOptions } from '#/lib/api'

export const Route = createFileRoute('/')({
  component: App,
  // Prefetch (bukan ensureQueryData) supaya angka sudah ikut ter-render saat SSR,
  // tapi halaman tetap jalan kalau API-nya mati — error-nya ditangani useQuery.
  loader: ({ context }) =>
    context.queryClient.prefetchQuery(tradesQueryOptions),
})

function App() {
  const { data, isPending, isError, error } = useQuery(tradesQueryOptions)

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="w-full h-fit relative bg-transparent pt-1 mb-7">
        {isError && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            Gagal memuat data trade: {(error as Error).message}
          </div>
        )}

        <TradeStatsCards stats={data?.stats} isLoading={isPending} />
      </div>

      <TradeCalendar />
    </main>
  )
}
