import { apiClient } from './client'
import type { ILead, CreateLeadPayload, UpdateLeadPayload, LeadFilters, PaginatedResponse, ApiResponse } from '@leadflow/shared'

export async function getLeads(params: LeadFilters): Promise<PaginatedResponse<ILead>> {
  const res = await apiClient.get<PaginatedResponse<ILead>>('/leads', { params })
  return res.data
}

export async function getLeadById(id: string): Promise<ILead> {
  const res = await apiClient.get<ApiResponse<ILead>>(`/leads/${id}`)
  return res.data.data
}

export async function createLead(data: CreateLeadPayload): Promise<ILead> {
  const res = await apiClient.post<ApiResponse<ILead>>('/leads', data)
  return res.data.data
}

export async function updateLead(id: string, data: UpdateLeadPayload): Promise<ILead> {
  const res = await apiClient.patch<ApiResponse<ILead>>(`/leads/${id}`, data)
  return res.data.data
}

export async function deleteLead(id: string): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(`/leads/${id}`)
}

export async function exportLeads(params: Omit<LeadFilters, 'page'|'limit'>): Promise<Blob> {
  const res = await apiClient.get<Blob>('/leads/export', {
    params,
    responseType: 'blob',
  })
  return res.data
}
