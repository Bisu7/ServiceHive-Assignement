import { z } from 'zod'
import { LeadStatus, LeadSource } from '@leadflow/shared'

/** Schema for creating a new lead */
export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(150),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  phone: z.string().trim().optional(),
  company: z.string().trim().max(150).optional(),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.New),
  source: z.nativeEnum(LeadSource).default(LeadSource.Other),
  value: z.number().nonnegative('Deal value must be non-negative').optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  assignedTo: z.string().optional(),
})

/** Schema for partial lead updates — all fields optional */
export const updateLeadSchema = createLeadSchema.partial()

/** Schema for query-string filters when listing leads */
export const leadFiltersSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
export type LeadFiltersInput = z.infer<typeof leadFiltersSchema>
