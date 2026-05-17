import { useLeadsStore } from '@/store/leadsStore'
import type { CreateLeadPayload, UpdateLeadPayload, LeadFilters } from '@leadflow/shared'

/**
 * React hook that bridges store states and CRUD actions for Leads,
 * keeping page controllers and details sync-aligned.
 */
export function useLeads() {
  const leads = useLeadsStore((state) => state.leads)
  const total = useLeadsStore((state) => state.total)
  const page = useLeadsStore((state) => state.page)
  const totalPages = useLeadsStore((state) => state.totalPages)
  const isLoading = useLeadsStore((state) => state.isLoading)
  const error = useLeadsStore((state) => state.error)
  const filters = useLeadsStore((state) => state.filters)

  const fetchLeads = useLeadsStore((state) => state.fetchLeads)
  const setFilter = useLeadsStore((state) => state.setFilter)
  const clearFilters = useLeadsStore((state) => state.clearFilters)
  const createLead = useLeadsStore((state) => state.createLead)
  const updateLead = useLeadsStore((state) => state.updateLead)
  const deleteLead = useLeadsStore((state) => state.deleteLead)

  return {
    leads,
    total,
    page,
    totalPages,
    isLoading,
    error,
    filters,
    fetchLeads,
    setFilter,
    clearFilters,
    createLead,
    updateLead,
    deleteLead,
  }
}
export default useLeads
