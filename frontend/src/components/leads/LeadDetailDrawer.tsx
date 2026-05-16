import { X, Mail, Phone, Building2, DollarSign, Calendar } from 'lucide-react'
import type { ILead } from '@leadflow/shared'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS } from '@/types/lead.types'
import { formatDate, formatDateTime, formatCurrency } from '@/utils/formatDate'
import { cn } from '@/utils/cn'

interface LeadDetailDrawerProps {
  lead: ILead | null
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

/** Slide-in drawer showing full lead details with edit and delete actions */
export function LeadDetailDrawer({ lead, isOpen, onClose, onEdit, onDelete }: LeadDetailDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer panel */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface-900 shadow-2xl',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Lead detail drawer"
        role="complementary"
      >
        {lead && (
          <>
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">{lead.name}</h2>
                {lead.company && <p className="text-sm text-slate-500">{lead.company}</p>}
              </div>
              <button onClick={onClose} aria-label="Close drawer" className="rounded-lg p-1 text-slate-400 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-4 flex items-center gap-2">
                <Badge colorClass={LEAD_STATUS_COLORS[lead.status]}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
                <span className="text-sm text-slate-500">{LEAD_SOURCE_LABELS[lead.source]}</span>
              </div>

              <dl className="flex flex-col gap-4">
                <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email} />
                {lead.phone && <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={lead.phone} />}
                {lead.company && <DetailRow icon={<Building2 className="h-4 w-4" />} label="Company" value={lead.company} />}
                {lead.value != null && <DetailRow icon={<DollarSign className="h-4 w-4" />} label="Deal Value" value={formatCurrency(lead.value)} />}
                <DetailRow icon={<Calendar className="h-4 w-4" />} label="Created" value={formatDateTime(lead.createdAt)} />
                <DetailRow icon={<Calendar className="h-4 w-4" />} label="Updated" value={formatDateTime(lead.updatedAt)} />
                {lead.notes && (
                  <div>
                    <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Notes</dt>
                    <dd className="rounded-lg bg-surface-800 p-3 text-sm text-slate-300">{lead.notes}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 px-6 py-4">
              <Button variant="secondary" onClick={onEdit} className="flex-1">Edit</Button>
              <Button variant="danger" onClick={onDelete}>Delete</Button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: string
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <dt className="mt-0.5 text-slate-500" aria-hidden>{icon}</dt>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
        <dd className="text-sm text-slate-200">{value}</dd>
      </div>
    </div>
  )
}
