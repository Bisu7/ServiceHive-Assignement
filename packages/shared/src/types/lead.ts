/**
 * Lead domain types — status lifecycle, acquisition source, and full lead shape.
 * These are the canonical definitions used across both client and server.
 */

export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Qualified = 'qualified',
  Lost = 'lost',
}

export enum LeadSource {
  Website = 'website',
  Instagram = 'instagram',
  Referral = 'referral',
}

/** Immutable fields are marked readonly to prevent accidental mutation */
export interface ILead {
  readonly _id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: LeadStatus
  source: LeadSource
  value?: number
  notes?: string
  /** ID of the user who owns/is assigned this lead */
  assignedTo?: string
  /** ID of the user who created this lead */
  createdBy: string
  readonly createdAt: string
  readonly updatedAt: string
}

/** Shape used when creating a new lead (server fills readonly fields) */
export type CreateLeadPayload = Omit<ILead, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>

/** Shape used when updating a lead */
export type UpdateLeadPayload = Partial<CreateLeadPayload>

/** Filters that can be applied when querying leads */
export interface LeadFilters {
  status?: LeadStatus
  source?: LeadSource
  search?: string
  page?: number
  limit?: number
}
