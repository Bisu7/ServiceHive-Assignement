import { create } from 'zustand'
import type { ILead, LeadFilters, PaginatedResponse } from '@leadflow/shared'

interface LeadsState {
  leads: ILead[]
  selectedLead: ILead | null
  filters: LeadFilters
  pagination: PaginatedResponse<ILead>['pagination'] | null
  isLoading: boolean
  /** Replaces the leads list with a new paginated response */
  setLeads: (response: PaginatedResponse<ILead>) => void
  /** Sets the currently viewed/edited lead */
  setSelectedLead: (lead: ILead | null) => void
  /** Updates filter criteria — resets page to 1 on any change */
  setFilters: (filters: Partial<LeadFilters>) => void
  /** Replaces a single lead in the list by ID (optimistic update support) */
  upsertLead: (lead: ILead) => void
  /** Removes a lead from the list by ID */
  removeLead: (id: string) => void
  setLoading: (loading: boolean) => void
}

/**
 * Zustand store for the leads list, filters, and pagination state.
 * Does not persist — data is always fresh from the server.
 */
export const useLeadsStore = create<LeadsState>()((set) => ({
  leads: [],
  selectedLead: null,
  filters: { page: 1, limit: 20 },
  pagination: null,
  isLoading: false,

  setLeads: (response) =>
    set({ leads: response.data, pagination: response.pagination, isLoading: false }),

  setSelectedLead: (lead) => set({ selectedLead: lead }),

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial, page: 1 },
    })),

  upsertLead: (lead) =>
    set((state) => {
      const exists = state.leads.some((l) => l._id === lead._id)
      return {
        leads: exists
          ? state.leads.map((l) => (l._id === lead._id ? lead : l))
          : [lead, ...state.leads],
      }
    }),

  removeLead: (id) =>
    set((state) => ({ leads: state.leads.filter((l) => l._id !== id) })),

  setLoading: (loading) => set({ isLoading: loading }),
}))
