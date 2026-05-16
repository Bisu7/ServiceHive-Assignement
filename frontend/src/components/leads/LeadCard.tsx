import type { ILead } from '@leadflow/shared'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/types/lead.types'
import { formatDate, formatCurrency } from '@/utils/formatDate'
import { Building2, Mail } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LeadCardProps {
  lead: ILead
  className?: string
}

/** Card view of a single lead — used in Kanban or grid layouts */
export function LeadCard({ lead, className }: LeadCardProps) {
  const navigate = useNavigate()

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/leads/${lead._id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/leads/${lead._id}`)}
      className={cn(
        'glass-card cursor-pointer p-4 transition-all duration-150',
        'hover:border-white/20 hover:bg-white/10',
        'animate-slide-up',
        className
      )}
      aria-label={`Lead: ${lead.name}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-100">{lead.name}</p>
          {lead.company && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <Building2 className="h-3 w-3" aria-hidden />
              {lead.company}
            </div>
          )}
        </div>
        <Badge colorClass={LEAD_STATUS_COLORS[lead.status]}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
      </div>

      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Mail className="h-3 w-3" aria-hidden />
        <span className="truncate">{lead.email}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">{formatCurrency(lead.value ?? null)}</span>
        <span className="text-xs text-slate-600">{formatDate(lead.createdAt)}</span>
      </div>
    </article>
  )
}
