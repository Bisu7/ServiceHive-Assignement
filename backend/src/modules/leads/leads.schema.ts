import { z } from 'zod'
import { LeadStatus, LeadSource } from '@leadflow/shared'

const objectIdRegex = /^[0-9a-fA-F]{24}$/

const objectIdSchema = z.string().regex(objectIdRegex, {
  message: 'Invalid ObjectId format',
})

/** Schema for creating a new lead */
export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be between 2 and 100 characters')
    .max(100, 'Name must be between 2 and 100 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.New),
  source: z.nativeEnum(LeadSource, {
    errorMap: () => ({ message: 'Lead source is required and must be website, instagram, or referral' }),
  }),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
  assignedTo: objectIdSchema.optional(),
})

/** Schema for partial lead updates — all fields optional, at least one field required */
export const updateLeadSchema = createLeadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field is required to update',
  }
)

/** Schema for query-string filters when listing leads */
export const leadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  search: z.string().trim().max(100).optional(),
  sortBy: z.enum(['latest', 'oldest']).default('latest'),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = Partial<CreateLeadInput>
export type LeadQuery = z.infer<typeof leadQuerySchema>
