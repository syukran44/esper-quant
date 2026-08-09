import type { ReactNode } from 'react'

import { cn } from '#/lib/utils'

export type StatTone = 'neutral' | 'positive' | 'negative'

const valueTone: Record<StatTone, string> = {
  neutral: 'text-foreground',
  positive: 'text-green-500 dark:text-green-400',
  negative: 'text-red-500 dark:text-red-400',
}

const iconTone: Record<StatTone, string> = {
  neutral: 'text-muted-foreground',
  positive: 'text-green-500 dark:text-green-400',
  negative: 'text-red-500 dark:text-red-400',
}

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon: ReactNode
  tone?: StatTone
  isLoading?: boolean
}

export default function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'neutral',
  isLoading = false,
}: StatCardProps) {
  return (
    <div className="rounded-lg border backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 bg-background">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-base font-medium text-muted-foreground">
          {label}
        </h3>
        <span className={cn('[&_svg]:h-6 [&_svg]:w-6', iconTone[tone])}>
          {icon}
        </span>
      </div>
      <div className="p-6 pt-0">
        {isLoading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        ) : (
          <div className={cn('text-2xl font-bold', valueTone[tone])}>
            {value}
          </div>
        )}
        {hint && !isLoading && (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  )
}
