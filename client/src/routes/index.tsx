import { createFileRoute } from '@tanstack/react-router'

import TradeCalendar from '#/components/trade-calendar'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="w-full h-fit relative bg-transparent pt-1 mb-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 lg:gap-4">
          <div
            className="rounded-lg border backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 bg-background">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-base font-medium text-muted-foreground">Win Rate</h3><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="h-6 w-6 text-muted-foreground">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold text-foreground">55.6%</div>
            </div>
          </div>
          <div
            className="rounded-lg border backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 bg-background">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-base font-medium text-muted-foreground">Total P&amp;L</h3><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="h-6 w-6 text-green-500 dark:text-green-400">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                <path d="M12 18V6"></path>
              </svg>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">$1.1K</div>
            </div>
          </div>
          <div
            className="rounded-lg border backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 bg-background">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-base font-medium text-muted-foreground">Returns</h3><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="h-6 w-6 text-green-500 dark:text-green-400">
                <path
                  d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z">
                </path>
                <path d="m15 9-6 6"></path>
                <path d="M9 9h.01"></path>
                <path d="M15 15h.01"></path>
              </svg>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">11.2%</div>
            </div>
          </div>
          <div
            className="rounded-lg border backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 bg-background">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-base font-medium text-muted-foreground">Profit Factor</h3><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                className="h-6 w-6 text-green-500 dark:text-green-400">
                <path d="m21 16-4 4-4-4"></path>
                <path d="M17 20V4"></path>
                <path d="m3 8 4-4 4 4"></path>
                <path d="M7 4v16"></path>
              </svg>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">2.21</div>
            </div>
          </div>
        </div>
      </div>

      <TradeCalendar/>
    </main>
  )
}