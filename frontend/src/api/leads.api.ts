import { apiClient } from './client'
import type { ILead, CreateLeadPayload, UpdateLeadPayload, LeadFilters, PaginatedResponse, ApiResponse } from '@leadflow/shared'

/** Fetches a paginated, filtered list of leads */
export async function getLeads(filters?: LeadFilters): Promise<PaginatedResponse<ILead>> {
  const res = await apiClient.get<PaginatedResponse<ILead>>('/leads', { params: filters })
  return res.data
}

/** Fetches a single lead by ID */
export async function getLeadById(id: string): Promise<ILead> {
  const res = await apiClient.get<ApiResponse<ILead>>(`/leads/${id}`)
  return res.data.data
}

/** Creates a new lead record */
export async function createLead(payload: CreateLeadPayload): Promise<ILead> {
  const res = await apiClient.post<ApiResponse<ILead>>('/leads', payload)
  return res.data.data
}

/** Partially updates a lead */
export async function updateLead(id: string, payload: UpdateLeadPayload): Promise<ILead> {
  const res = await apiClient.patch<ApiResponse<ILead>>(`/leads/${id}`, payload)
  return res.data.data
}

/** Permanently deletes a lead */
export async function deleteLead(id: string): Promise<void> {
  await apiClient.delete(`/leads/${id}`)
}
