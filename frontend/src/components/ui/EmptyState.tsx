import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

/** Empty state illustration with optional CTA for empty data views */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800">
        <Inbox className="h-8 w-8 text-slate-500" aria-hidden />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-slate-300">{title}</p>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
