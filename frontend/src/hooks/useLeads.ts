import { useCallback, useEffect } from 'react'
import { useLeadsStore } from '@/store/leadsStore'
import * as leadsApi from '@/api/leads.api'
import type { CreateLeadPayload, UpdateLeadPayload } from '@leadflow/shared'
import toast from 'react-hot-toast'

/**
 * Hook that bridges the leads store with the leads API.
 * Provides data-fetching actions with built-in loading state and error toasts.
 */
export function useLeads() {
  const { leads, filters, pagination, isLoading, setLeads, setFilters, upsertLead, removeLead, setLoading } =
    useLeadsStore()

  const fetchLeads = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await leadsApi.getLeads(filters)
      setLeads(response)
    } catch {
      toast.error('Failed to load leads')
      setLoading(false)
    }
  }, [filters, setLeads, setLoading])

  // Refetch whenever filters change
  useEffect(() => {
    void fetchLeads()
  }, [fetchLeads])

  const createLead = useCallback(
    async (payload: CreateLeadPayload): Promise<void> => {
      const lead = await leadsApi.createLead(payload)
      upsertLead(lead)
      toast.success('Lead created successfully')
    },
    [upsertLead]
  )

  const updateLead = useCallback(
    async (id: string, payload: UpdateLeadPayload): Promise<void> => {
      const lead = await leadsApi.updateLead(id, payload)
      upsertLead(lead)
      toast.success('Lead updated successfully')
    },
    [upsertLead]
  )

  const deleteLead = useCallback(
    async (id: string): Promise<void> => {
      await leadsApi.deleteLead(id)
      removeLead(id)
      toast.success('Lead deleted')
    },
    [removeLead]
  )

  return { leads, filters, pagination, isLoading, setFilters, createLead, updateLead, deleteLead, refetch: fetchLeads }
}
