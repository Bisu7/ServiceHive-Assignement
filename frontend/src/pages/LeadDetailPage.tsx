import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLeadById } from '@/api/leads.api'
import type { ILead } from '@leadflow/shared'
import { PageSpinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS } from '@/types/lead.types'
import { formatDateTime, formatCurrency } from '@/utils/formatDate'
import { ArrowLeft, Mail, Phone, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

/** Standalone lead detail page for direct URL navigation */
export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<ILead | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getLeadById(id)
      .then(setLead)
      .catch(() => {
        toast.error('Lead not found')
        navigate('/leads')
      })
      .finally(() => setIsLoading(false))
  }, [id, navigate])

  if (isLoading) return <PageSpinner />

  if (!lead) return null

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6" aria-label="Go back">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </Button>

      <article className="glass-card p-8">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
            {lead.company && <p className="mt-1 text-slate-400">{lead.company}</p>}
          </div>
          <Badge colorClass={LEAD_STATUS_COLORS[lead.status]}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
        </header>

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DetailItem icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email} />
          {lead.phone && <DetailItem icon={<Phone className="h-4 w-4" />} label="Phone" value={lead.phone} />}
          {lead.company && <DetailItem icon={<Building2 className="h-4 w-4" />} label="Company" value={lead.company} />}
          <DetailItem label="Source" value={LEAD_SOURCE_LABELS[lead.source]} />
          {lead.value != null && <DetailItem label="Deal Value" value={formatCurrency(lead.value)} />}
          <DetailItem label="Created" value={formatDateTime(lead.createdAt)} />
          <DetailItem label="Last Updated" value={formatDateTime(lead.updatedAt)} />
        </dl>

        {lead.notes && (
          <div className="mt-6">
            <dt className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Notes</dt>
            <dd className="rounded-lg bg-surface-800 p-4 text-sm leading-relaxed text-slate-300">{lead.notes}</dd>
          </div>
        )}
      </article>
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </dt>
      <dd className="text-sm text-slate-200">{value}</dd>
    </div>
  )
}
