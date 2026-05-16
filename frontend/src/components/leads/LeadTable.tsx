import type { ILead } from '@leadflow/shared'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS } from '@/types/lead.types'
import { formatDate, formatCurrency } from '@/utils/formatDate'
import type { PaginatedResponse } from '@leadflow/shared'

interface LeadTableProps {
  leads: ILead[]
  isLoading: boolean
  pagination: PaginatedResponse<ILead>['pagination'] | null
  onPageChange: (page: number) => void
  onRowClick: (lead: ILead) => void
}

/** Data table listing leads with status badges, value, source, and date */
export function LeadTable({ leads, isLoading, pagination, onPageChange, onRowClick }: LeadTableProps) {


  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (leads.length === 0) {
    return <EmptyState title="No leads found" description="Try adjusting your filters or create your first lead." />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm" aria-label="Leads table">
          <thead>
            <tr className="border-b border-white/10 bg-surface-800/50 text-left">
              <th className="px-4 py-3 font-medium text-slate-400">Name</th>
              <th className="px-4 py-3 font-medium text-slate-400">Status</th>
              <th className="px-4 py-3 font-medium text-slate-400">Source</th>
              <th className="px-4 py-3 font-medium text-slate-400">Value</th>
              <th className="px-4 py-3 font-medium text-slate-400">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                onClick={() => onRowClick(lead)}
                className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-200">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge colorClass={LEAD_STATUS_COLORS[lead.status]}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-400">{LEAD_SOURCE_LABELS[lead.source]}</td>
                <td className="px-4 py-3 font-medium text-slate-200">{formatCurrency(lead.value ?? null)}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
