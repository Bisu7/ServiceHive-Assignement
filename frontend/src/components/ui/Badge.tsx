import React from 'react'
import { LeadStatus, LeadSource } from '@leadflow/shared'
import { cn } from '@/utils/cn'

export interface BadgeProps {
  status?: LeadStatus
  source?: LeadSource
  label?: string
  color?: 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'slate'
  className?: string
}

export const Badge = React.memo(({ status, source, label, color, className }: BadgeProps) => {
  let badgeLabel = label || ''
  let badgeColor: 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'slate' = color || 'slate'

  // Map LeadStatus to labels & colors
  if (status) {
    badgeLabel = status.toUpperCase()
    if (status === LeadStatus.New) badgeColor = 'blue'
    else if (status === LeadStatus.Contacted) badgeColor = 'amber'
    else if (status === LeadStatus.Qualified) badgeColor = 'green'
    else if (status === LeadStatus.Lost) badgeColor = 'red'
  }
  // Map LeadSource to labels & colors
  else if (source) {
    badgeLabel = source.toUpperCase()
    if (source === LeadSource.Website) badgeColor = 'purple'
    else if (source === LeadSource.Instagram) badgeColor = 'amber'
    else if (source === LeadSource.Referral) badgeColor = 'blue'
  }

  // Obsidian UI Styling: 10% opacity body, 100% opacity solid 3px left border
  const colorsMap = {
    blue: 'bg-blue-500/10 border-blue-500 text-blue-300',
    amber: 'bg-amber-500/10 border-amber-500 text-amber-300',
    green: 'bg-emerald-500/10 border-emerald-500 text-emerald-300',
    red: 'bg-rose-500/10 border-rose-500 text-rose-300',
    purple: 'bg-violet-500/10 border-violet-500 text-violet-300',
    slate: 'bg-slate-500/10 border-slate-500 text-slate-300',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border-l-[3px]',
        colorsMap[badgeColor],
        className
      )}
    >
      {badgeLabel}
    </span>
  )
})

Badge.displayName = 'Badge'
export default Badge
