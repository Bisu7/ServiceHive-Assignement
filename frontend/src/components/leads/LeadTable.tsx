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

/** Professional data table for lead management */
export function LeadTable({ leads, isLoading, pagination, onPageChange, onRowClick }: LeadTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (leads.length === 0) {
    return <EmptyState title="No leads found" description="Try adjusting your filters or create your first lead." />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50">
        <table className="w-full text-sm" aria-label="Leads table">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-left dark:border-zinc-800 dark:bg-zinc-900">
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Name</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Source</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Value</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                onClick={() => onRowClick(lead)}
                className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge colorClass={LEAD_STATUS_COLORS[lead.status]}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600 dark:text-zinc-400">{LEAD_SOURCE_LABELS[lead.source]}</td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(lead.value ?? null)}</td>
                <td className="px-6 py-4 text-right text-slate-500">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex justify-between items-center px-2">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="text-slate-900 dark:text-white">{leads.length}</span> leads
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
