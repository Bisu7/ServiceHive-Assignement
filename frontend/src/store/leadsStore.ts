import { create } from 'zustand'
import type { ILead, LeadFilters, CreateLeadPayload, UpdateLeadPayload } from '@leadflow/shared'
import * as leadsApi from '@/api/leads.api'

interface LeadsState {
  leads: ILead[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  error: string | null
  filters: LeadFilters
  selectedLead: ILead | null
  
  setSelectedLead: (lead: ILead | null) => void
  fetchLeads: (query?: Partial<LeadFilters>) => Promise<void>
  setFilter: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => Promise<void>
  clearFilters: () => Promise<void>
  createLead: (data: CreateLeadPayload) => Promise<void>
  updateLead: (id: string, data: UpdateLeadPayload) => Promise<void>
  deleteLead: (id: string) => Promise<void>
}

export const useLeadsStore = create<LeadsState>()((set, get) => ({
  leads: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    search: undefined,
    status: undefined,
    source: undefined,
    sortBy: 'latest',
  },
  selectedLead: null,

  setSelectedLead: (lead) => set({ selectedLead: lead }),

  fetchLeads: async (query) => {
    set({ isLoading: true, error: null })
    const currentFilters = get().filters
    const mergedFilters = {
      ...currentFilters,
      ...query,
    }

    // Standardize empty options
    Object.keys(mergedFilters).forEach((key) => {
      const k = key as keyof LeadFilters
      if (mergedFilters[k] === '') {
        mergedFilters[k] = undefined as any
      }
    })

    try {
      const response = await leadsApi.getLeads(mergedFilters)
      set({
        leads: response.data,
        total: response.pagination.total,
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        filters: mergedFilters,
        isLoading: false,
      })
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch leads',
        isLoading: false,
      })
    }
  },

  setFilter: async (key, value) => {
    const newFilters = {
      ...get().filters,
      [key]: value === '' ? undefined : value,
      page: key === 'page' ? (value as number) : 1,
    }
    set({ filters: newFilters })
    await get().fetchLeads(newFilters)
  },

  clearFilters: async () => {
    const defaultFilters: LeadFilters = {
      page: 1,
      limit: 10,
      search: undefined,
      status: undefined,
      source: undefined,
      sortBy: 'latest',
    }
    set({ filters: defaultFilters })
    await get().fetchLeads(defaultFilters)
  },

  createLead: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await leadsApi.createLead(data)
      await get().fetchLeads()
    } catch (err: any) {
      set({ error: err.message || 'Failed to create lead', isLoading: false })
      throw err
    }
  },

  updateLead: async (id, data) => {
    const originalLeads = get().leads
    // Optimistic Update
    set((state) => ({
      leads: state.leads.map((l) => (l._id === id ? ({ ...l, ...data } as any) : l)),
    }))
    try {
      const updated = await leadsApi.updateLead(id, data)
      set((state) => ({
        leads: state.leads.map((l) => (l._id === id ? updated : l)),
        selectedLead: state.selectedLead?._id === id ? updated : state.selectedLead,
      }))
    } catch (err: any) {
      set({ leads: originalLeads })
      throw err
    }
  },

  deleteLead: async (id) => {
    const originalLeads = get().leads
    const newLeads = originalLeads.filter((l) => l._id !== id)
    set({ leads: newLeads })
    try {
      await leadsApi.deleteLead(id)
      if (newLeads.length === 0) {
        await get().fetchLeads()
      }
    } catch (err: any) {
      set({ leads: originalLeads })
      throw err
    }
  },
}))
