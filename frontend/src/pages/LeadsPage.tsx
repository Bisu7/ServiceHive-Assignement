import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLeadsStore } from '@/store/leadsStore'
import { usePermissions } from '@/hooks/usePermissions'
import { LeadTable } from '@/components/leads/LeadTable'
import { LeadFilters } from '@/components/leads/LeadFilters'
import { LeadDetailDrawer } from '@/components/leads/LeadDetailDrawer'
import { LeadForm, LeadFormValues } from '@/components/leads/LeadForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { Plus, Download, AlertTriangle } from 'lucide-react'
import { exportCsvBlob } from '@/utils/exportCsv'
import * as leadsApi from '@/api/leads.api'
import { ILead, LeadStatus, LeadSource } from '@leadflow/shared'
import toast from 'react-hot-toast'

export function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const leads = useLeadsStore((state) => state.leads)
  const total = useLeadsStore((state) => state.total)
  const page = useLeadsStore((state) => state.page)
  const totalPages = useLeadsStore((state) => state.totalPages)
  const isLoading = useLeadsStore((state) => state.isLoading)
  const error = useLeadsStore((state) => state.error)
  const filters = useLeadsStore((state) => state.filters)

  const fetchLeads = useLeadsStore((state) => state.fetchLeads)
  const setFilter = useLeadsStore((state) => state.setFilter)
  const createLead = useLeadsStore((state) => state.createLead)
  const updateLead = useLeadsStore((state) => state.updateLead)
  const deleteLead = useLeadsStore((state) => state.deleteLead)

  const selectedLead = useLeadsStore((state) => state.selectedLead)
  const setSelectedLead = useLeadsStore((state) => state.setSelectedLead)

  const { canExportLeads } = usePermissions()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<ILead | null>(null)
  
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [isExportLoading, setIsExportLoading] = useState(false)

  // 1. URL -> Store sync on mount
  useEffect(() => {
    const search = searchParams.get('search') || undefined
    const status = (searchParams.get('status') as LeadStatus) || undefined
    const source = (searchParams.get('source') as LeadSource) || undefined
    const sortBy = (searchParams.get('sortBy') as any) || 'latest'
    const pageVal = parseInt(searchParams.get('page') || '1', 10)

    fetchLeads({
      search,
      status,
      source,
      sortBy,
      page: pageVal,
    })
  }, [])

  // 2. Store -> URL sync on filter updates
  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.search) next.set('search', filters.search)
    if (filters.status) next.set('status', filters.status)
    if (filters.source) next.set('source', filters.source)
    if (filters.sortBy) next.set('sortBy', filters.sortBy)
    if (filters.page && filters.page > 1) {
      next.set('page', filters.page.toString())
    }
    setSearchParams(next, { replace: true })
  }, [filters, setSearchParams])

  const handleCreate = async (data: LeadFormValues) => {
    setIsSubmitLoading(true)
    try {
      await createLead(data as any)
      setIsCreateOpen(false)
      toast.success('Lead registered successfully')
    } catch (err: any) {
      // Inline form error will handle it, or show general toast if needed
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const handleUpdate = async (data: LeadFormValues) => {
    if (!selectedLead) return
    setIsSubmitLoading(true)
    try {
      await updateLead(selectedLead._id, data as any)
      setIsEditOpen(false)
      setSelectedLead(null)
      toast.success('Lead updated successfully')
    } catch (err: any) {
      // Handled inline
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return
    setIsSubmitLoading(true)
    try {
      await deleteLead(leadToDelete._id)
      setIsDeleteOpen(false)
      setLeadToDelete(null)
      setSelectedLead(null)
      toast.success('Lead deleted successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete lead')
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExportLoading(true)
    try {
      const exportParams = {
        search: filters.search,
        status: filters.status,
        source: filters.source,
        sortBy: filters.sortBy,
      }
      const blob = await leadsApi.exportLeads(exportParams)
      exportCsvBlob(blob, `leads-export-${new Date().toISOString().split('T')[0]}.csv`)
      toast.success('CSV report downloaded successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to export CSV')
    } finally {
      setIsExportLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Lead Records</h2>
          <p className="text-sm text-slate-400 font-mono">
            {isLoading ? 'Syncing...' : `${total} entries found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canExportLeads() && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              loading={isExportLoading}
              disabled={isLoading || leads.length === 0}
              icon={<Download size={14} />}
            >
              Export CSV
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            icon={<Plus size={14} />}
          >
            New Lead
          </Button>
        </div>
      </div>

      <LeadFilters />

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-xl text-center flex flex-col items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
          <div>
            <p className="text-sm font-semibold text-white">Failed to retrieve pipeline data</p>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => fetchLeads()}>
            Try Again
          </Button>
        </div>
      ) : (
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          sortBy={filters.sortBy || 'latest'}
          onSortChange={(sort) => setFilter('sortBy', sort)}
          onRowClick={setSelectedLead}
          onEdit={(l) => {
            setSelectedLead(l)
            setIsEditOpen(true)
          }}
          onDelete={(l) => {
            setLeadToDelete(l)
            setIsDeleteOpen(true)
          }}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setFilter('page', p)}
        />
      )}

      {/* MODALS */}
      {/* Create Lead Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register New Lead" size="md">
        <LeadForm mode="create" onSubmit={handleCreate} loading={isSubmitLoading} />
      </Modal>

      {/* Edit Lead Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Lead Information" size="md">
        {selectedLead && (
          <LeadForm
            mode="edit"
            initialData={{
              name: selectedLead.name,
              email: selectedLead.email,
              status: selectedLead.status,
              source: selectedLead.source,
              notes: selectedLead.notes || '',
            }}
            onSubmit={handleUpdate}
            loading={isSubmitLoading}
          />
        )}
      </Modal>

      {/* Delete Lead Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion" size="sm">
        <div className="flex flex-col gap-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-white">Delete Lead Profile</h4>
            <p className="text-xs text-slate-400 mt-1">
              Are you sure you want to permanently delete <strong>{leadToDelete?.name}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setIsDeleteOpen(false)
                setLeadToDelete(null)
              }}
              disabled={isSubmitLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDeleteConfirm}
              loading={isSubmitLoading}
            >
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>

      {/* Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={!!selectedLead && !isEditOpen && !isDeleteOpen}
        onClose={() => setSelectedLead(null)}
        onEdit={(l) => {
          setSelectedLead(l)
          setIsEditOpen(true)
        }}
        onDelete={(l) => {
          setLeadToDelete(l)
          setIsDeleteOpen(true)
        }}
      />
    </div>
  )
}

export default LeadsPage
