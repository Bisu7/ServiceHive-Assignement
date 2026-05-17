import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLeadById } from '@/api/leads.api'
import type { ILead } from '@leadflow/shared'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/utils/formatDate'
import { ArrowLeft, Mail, FileText, Calendar, User } from 'lucide-react'
import toast from 'react-hot-toast'

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

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-obsidian-800 text-accent gap-4">
        <Spinner size="lg" />
        <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Loading Details...</span>
      </div>
    )
  }

  if (!lead) return null

  return (
    <div className="mx-auto max-w-2xl animate-fade-in p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6" icon={<ArrowLeft size={14} />}>
        Back
      </Button>

      <article className="bg-obsidian-700 border border-white/[0.05] p-8 rounded-xl">
        <header className="mb-6 flex items-start justify-between border-b border-white/[0.05] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{lead.name}</h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Mail size={14} />
              <span>{lead.email}</span>
            </div>
          </div>
          <Badge status={lead.status} />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-obsidian-800/40 p-4 rounded-lg border border-white/[0.03]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Source</span>
            <Badge source={lead.source} />
          </div>

          <div className="bg-obsidian-800/40 p-4 rounded-lg border border-white/[0.03]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Created By</span>
            <span className="text-sm text-slate-300 font-mono block mt-0.5 truncate">{lead.createdBy || 'Unknown User'}</span>
          </div>

          <div className="bg-obsidian-800/40 p-4 rounded-lg border border-white/[0.03] flex items-center gap-3 col-span-1 sm:col-span-2">
            <Calendar size={16} className="text-slate-500" />
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Timestamps</span>
              <span className="text-sm text-slate-300 block mt-0.5">
                Registered: <span className="font-mono">{formatDateTime(lead.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>

        {lead.notes && (
          <div className="mt-6 flex gap-3 items-start bg-obsidian-800/20 p-4 rounded-lg border border-white/[0.03]">
            <FileText size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-400 block">Notes</span>
              <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed break-words">{lead.notes}</p>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

export default LeadDetailPage
