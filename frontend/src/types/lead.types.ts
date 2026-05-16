/**
 * Client-side type augmentations for the lead domain.
 * Imports canonical types from @leadflow/shared and adds UI-specific helpers.
 */
export type { ILead, CreateLeadPayload, UpdateLeadPayload, LeadFilters } from '@leadflow/shared'
export { LeadStatus, LeadSource } from '@leadflow/shared'

/** Maps LeadStatus values to display labels and color variants */
export const LEAD_STATUS_LABELS: Record<import('@leadflow/shared').LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
}

export const LEAD_STATUS_COLORS: Record<import('@leadflow/shared').LeadStatus, string> = {
  new: 'bg-slate-500/20 text-slate-300',
  contacted: 'bg-blue-500/20 text-blue-300',
  qualified: 'bg-indigo-500/20 text-indigo-300',
  proposal: 'bg-violet-500/20 text-violet-300',
  negotiation: 'bg-amber-500/20 text-amber-300',
  won: 'bg-emerald-500/20 text-emerald-300',
  lost: 'bg-red-500/20 text-red-300',
}

export const LEAD_SOURCE_LABELS: Record<import('@leadflow/shared').LeadSource, string> = {
  website: 'Website',
  referral: 'Referral',
  linkedin: 'LinkedIn',
  cold_email: 'Cold Email',
  event: 'Event',
  advertisement: 'Advertisement',
  other: 'Other',
}
