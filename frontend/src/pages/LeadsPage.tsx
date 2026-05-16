import { useState } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { LeadTable } from '@/components/leads/LeadTable'
import { LeadFilters } from '@/components/leads/LeadFilters'
import { LeadDetailDrawer } from '@/components/leads/LeadDetailDrawer'
import { LeadForm } from '@/components/leads/LeadForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Plus, Download } from 'lucide-react'
import { exportLeadsToCsv } from '@/utils/exportCsv'
import { useLeadsStore } from '@/store/leadsStore'
import type { ILead } from '@leadflow/shared'
import toast from 'react-hot-toast'

/** Leads list page with filters, table, create modal, and detail drawer */
export function LeadsPage() {
  const { leads, filters, pagination, isLoading, setFilters, createLead, updateLead, deleteLead } = useLeads()
  const selectedLead = useLeadsStore((state) => state.selectedLead)
  const setSelectedLead = useLeadsStore((state) => state.setSelectedLead)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCreate = async (data: Parameters<typeof createLead>[0]): Promise<void> => {
    setIsCreating(true)
    try {
      await createLead(data)
      setIsCreateOpen(false)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (data: Parameters<typeof updateLead>[1]): Promise<void> => {
    if (!selectedLead) return
    setIsUpdating(true)
    try {
      await updateLead(selectedLead._id, data)
      setIsEditOpen(false)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!selectedLead) return
    if (!window.confirm(`Delete lead "${selectedLead.name}"? This cannot be undone.`)) return
    try {
      await deleteLead(selectedLead._id)
      setSelectedLead(null)
    } catch {
      toast.error('Failed to delete lead')
    }
  }

  const handleRowSelect = (lead: ILead): void => {
    setSelectedLead(lead)
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Leads</h2>
          <p className="text-sm text-slate-400">
            {pagination ? `${pagination.total} total leads` : 'Manage your sales pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => exportLeadsToCsv(leads)} aria-label="Export leads to CSV">
            <Download className="h-4 w-4" aria-hidden />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)} aria-label="Create new lead">
            <Plus className="h-4 w-4" aria-hidden />
            New Lead
          </Button>
        </div>
      </div>

      <LeadFilters />

      <LeadTable
        leads={leads}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => setFilters({ page })}
        onRowClick={handleRowSelect}
      />

      {/* Create lead modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Lead" size="lg">
        <LeadForm
          onSubmit={handleCreate}
          isLoading={isCreating}
          submitLabel="Create lead"
        />
      </Modal>

      {/* Edit lead modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Lead" size="lg">
        <LeadForm
          defaultValues={selectedLead ?? undefined}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
          submitLabel="Save changes"
        />
      </Modal>

      {/* Detail drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={!!selectedLead && !isEditOpen}
        onClose={() => setSelectedLead(null)}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => { void handleDelete() }}
      />
    </div>
  )
}

