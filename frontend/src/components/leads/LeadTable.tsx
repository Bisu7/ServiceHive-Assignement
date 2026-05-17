import React from 'react'
import type { ILead } from '@leadflow/shared'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react'

import { usePermissions } from '@/hooks/usePermissions'

interface LeadRowProps {
  lead: ILead
  onRowClick: (lead: ILead) => void
  onEdit: (e: React.MouseEvent, lead: ILead) => void
  onDelete: (e: React.MouseEvent, lead: ILead) => void
}

const LeadRow = React.memo(({ lead, onRowClick, onEdit, onDelete }: LeadRowProps) => {
  const { user, canDeleteAnyLead } = usePermissions()

  const creatorId = typeof lead.createdBy === 'object' && lead.createdBy ? (lead.createdBy as any)._id || (lead.createdBy as any).id : lead.createdBy
  const currentUserId = user?._id
  const isOwner = creatorId && currentUserId && String(creatorId) === String(currentUserId)
  const canDelete = canDeleteAnyLead() || isOwner

  return (
    <tr
      onClick={() => onRowClick(lead)}
      className="cursor-pointer transition-colors border-b border-white/[0.04] hover:bg-white/[0.03] group"
    >
      <td className="px-6 py-3.5">
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-slate-100 truncate text-sm">{lead.name}</span>
          <span className="text-xs text-slate-500 truncate">{lead.email}</span>
        </div>
      </td>
      <td className="px-6 py-3.5"><Badge status={lead.status} /></td>
      <td className="px-6 py-3.5"><Badge source={lead.source} /></td>
      <td className="px-6 py-3.5 text-sm text-slate-400 font-mono">{formatDate(lead.createdAt)}</td>
      <td className="px-6 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => onEdit(e, lead)} className="text-slate-400 hover:text-white transition-colors" title="Edit lead">
            <Edit2 size={14} />
          </button>
          {canDelete && (
            <button onClick={(e) => onDelete(e, lead)} className="text-slate-400 hover:text-rose-400 transition-colors" title="Delete lead">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
})
LeadRow.displayName = 'LeadRow'

export interface LeadTableProps {
  leads: ILead[]
  isLoading: boolean
  sortBy: 'latest' | 'oldest'
  onSortChange: (sort: 'latest' | 'oldest') => void
  onRowClick: (lead: ILead) => void
  onEdit: (lead: ILead) => void
  onDelete: (lead: ILead) => void
}

export function LeadTable({ leads, isLoading, sortBy, onSortChange, onRowClick, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-obsidian-700 border border-white/[0.05] rounded-xl">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/[0.05] text-xs font-semibold uppercase tracking-wider text-slate-400 bg-obsidian-800/40">
            <th className="px-6 py-3 font-semibold">Name & Email</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 font-semibold">Source</th>
            <th className="px-6 py-3 font-semibold cursor-pointer select-none hover:text-white transition-colors" onClick={() => onSortChange(sortBy === 'latest' ? 'oldest' : 'latest')}>
              <div className="flex items-center gap-1.5">
                Created Date
                <ArrowUpDown size={12} className={sortBy === 'latest' ? 'text-accent' : 'text-slate-500'} />
              </div>
            </th>
            <th className="px-6 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse border-b border-white/[0.03]">
                <td className="px-6 py-3.5"><div className="h-4 w-32 bg-white/[0.04] rounded mb-1" /><div className="h-3 w-48 bg-white/[0.02] rounded" /></td>
                <td className="px-6 py-3.5"><div className="h-5 w-20 bg-white/[0.04] rounded-md" /></td>
                <td className="px-6 py-3.5"><div className="h-5 w-24 bg-white/[0.04] rounded-md" /></td>
                <td className="px-6 py-3.5"><div className="h-4 w-24 bg-white/[0.04] rounded" /></td>
                <td className="px-6 py-3.5"><div className="h-4 w-8 bg-white/[0.04] rounded ml-auto" /></td>
              </tr>
            ))
          ) : leads.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-12 text-sm text-slate-500 font-medium">No matching pipeline leads found.</td></tr>
          ) : (
            leads.map((lead) => (
              <LeadRow
                key={lead._id}
                lead={lead}
                onRowClick={onRowClick}
                onEdit={(e, l) => { e.stopPropagation(); onEdit(l); }}
                onDelete={(e, l) => { e.stopPropagation(); onDelete(l); }}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default LeadTable
