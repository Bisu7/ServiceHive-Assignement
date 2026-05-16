/**
 * Client-side type augmentations for the lead domain.
 * Imports canonical types from @leadflow/shared and adds UI-specific helpers.
 */
import { LeadStatus, LeadSource } from '@leadflow/shared'

export type { ILead, CreateLeadPayload, UpdateLeadPayload, LeadFilters } from '@leadflow/shared'
export { LeadStatus, LeadSource }

/** Maps LeadStatus values to display labels and color variants */
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'New',
  [LeadStatus.Contacted]: 'Contacted',
  [LeadStatus.Qualified]: 'Qualified',
  [LeadStatus.Proposal]: 'Proposal',
  [LeadStatus.Negotiation]: 'Negotiation',
  [LeadStatus.Won]: 'Won',
  [LeadStatus.Lost]: 'Lost',
}

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700',
  [LeadStatus.Contacted]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50',
  [LeadStatus.Qualified]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50',
  [LeadStatus.Proposal]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50',
  [LeadStatus.Negotiation]: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/50',
  [LeadStatus.Won]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50',
  [LeadStatus.Lost]: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50',
}

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  [LeadSource.Website]: 'Website',
  [LeadSource.Referral]: 'Referral',
  [LeadSource.LinkedIn]: 'LinkedIn',
  [LeadSource.ColdEmail]: 'Cold Email',
  [LeadSource.Event]: 'Event',
  [LeadSource.Advertisement]: 'Advertisement',
  [LeadSource.Other]: 'Other',
}
