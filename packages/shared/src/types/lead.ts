/**
 * Lead domain types — status lifecycle, acquisition source, and full lead shape.
 * These are the canonical definitions used across both client and server.
 */

export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Qualified = 'qualified',
  Proposal = 'proposal',
  Negotiation = 'negotiation',
  Won = 'won',
  Lost = 'lost',
}

export enum LeadSource {
  Website = 'website',
  Referral = 'referral',
  LinkedIn = 'linkedin',
  ColdEmail = 'cold_email',
  Event = 'event',
  Advertisement = 'advertisement',
  Other = 'other',
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
  /** Estimated deal value in USD */
  value?: number
  notes?: string
  /** ID of the user who owns this lead */
  assignedTo?: string
  readonly createdAt: string
  readonly updatedAt: string
}

/** Partial shape used when creating a new lead (server fills readonly fields) */
export type CreateLeadPayload = Omit<ILead, '_id' | 'createdAt' | 'updatedAt'>

/** Partial shape used when updating a lead */
export type UpdateLeadPayload = Partial<CreateLeadPayload>

/** Filters that can be applied when querying leads */
export interface LeadFilters {
  status?: LeadStatus
  source?: LeadSource
  search?: string
  page?: number
  limit?: number
}
