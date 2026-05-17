import React, { useEffect } from 'react'
import type { ILead } from '@leadflow/shared'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import { X, Edit2, Trash2, Calendar, Mail, FileText, User } from 'lucide-react'

import { usePermissions } from '@/hooks/usePermissions'

export interface LeadDetailDrawerProps {
  isOpen: boolean
  lead: ILead | null
  onClose: () => void
  onEdit: (lead: ILead) => void
  onDelete: (lead: ILead) => void
}

export function LeadDetailDrawer({ isOpen, lead, onClose, onEdit, onDelete }: LeadDetailDrawerProps) {
  const { user, canDeleteAnyLead } = usePermissions()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !lead) return null

  const creatorId = typeof lead.createdBy === 'object' && lead.createdBy ? (lead.createdBy as any)._id || (lead.createdBy as any).id : lead.createdBy
  const currentUserId = user?._id
  const isOwner = creatorId && currentUserId && String(creatorId) === String(currentUserId)
  const canDelete = canDeleteAnyLead() || isOwner

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" />
      <div className="relative w-full max-w-md h-full bg-obsidian-700 border-l border-white/[0.05] p-6 shadow-2xl flex flex-col z-10 transition-transform duration-300 translate-x-0 animate-slide-in">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-6">
          <h3 className="text-base font-semibold text-slate-100 uppercase tracking-wider">Lead Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.03] transition-colors" aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none pr-1">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 truncate">{lead.name}</h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Mail size={14} className="text-slate-500" />
              <span className="truncate">{lead.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-obsidian-800/40 p-3 rounded-lg border border-white/[0.03]">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</span>
              <Badge status={lead.status} />
            </div>
            <div className="bg-obsidian-800/40 p-3 rounded-lg border border-white/[0.03]">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Source</span>
              <Badge source={lead.source} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-400 block">Notes</span>
                <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed bg-obsidian-800/20 p-3 rounded-lg border border-white/[0.03] break-words">
                  {lead.notes || 'No notes added yet.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User size={16} className="text-slate-500 flex-shrink-0" />
              <div className="truncate">
                <span className="text-xs font-semibold text-slate-400 block">Creator Reference</span>
                <span className="text-sm text-slate-300 truncate block mt-0.5 font-mono">{lead.createdBy || 'Unknown User'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-slate-500 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Registered On</span>
                <span className="text-sm text-slate-300 font-mono block mt-0.5">{formatDateTime(lead.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-4 mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => onEdit(lead)} icon={<Edit2 size={14} />}>Edit Profile</Button>
          {canDelete && (
            <Button variant="danger" className="flex-1" onClick={() => onDelete(lead)} icon={<Trash2 size={14} />}>Delete Lead</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadDetailDrawer
