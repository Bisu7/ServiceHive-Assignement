import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  /** Pre-built color classes — pass a string from LEAD_STATUS_COLORS or define custom ones */
  colorClass?: string | undefined
  className?: string | undefined
}

/** Compact status/label badge with configurable color */
export function Badge({ children, colorClass = 'bg-slate-500/20 text-slate-300', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        className
      )}
    >
      {children}
    </span>
  )
}
