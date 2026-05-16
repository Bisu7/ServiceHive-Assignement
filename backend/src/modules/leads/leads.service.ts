import { LeadModel } from './leads.model'
import { ApiError } from '../../utils/ApiError'
import type { CreateLeadInput, UpdateLeadInput, LeadFiltersInput } from './leads.schema'
import type { PaginatedResponse, ILead } from '@leadflow/shared'

export async function getLeads(filters: LeadFiltersInput) {
  const { page, limit, status, source, search } = filters
  const skip = (page - 1) * limit

  // Build query predicates dynamically based on provided filters
  const query: Record<string, unknown> = {}
  if (status) query['status'] = status
  if (source) query['source'] = source
  if (search) query['$text'] = { $search: search }

  const [leads, total] = await Promise.all([
    LeadModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    LeadModel.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    leads: leads as unknown as ILead[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

export async function getLeadById(id: string): Promise<ILead> {
  const lead = await LeadModel.findById(id).lean()
  if (!lead) throw ApiError.notFound(`Lead with id '${id}' not found`)
  return lead as unknown as ILead
}

export async function createLead(input: CreateLeadInput): Promise<ILead> {
  const lead = await LeadModel.create(input)
  return lead.toJSON() as unknown as ILead
}

export async function updateLead(id: string, input: UpdateLeadInput): Promise<ILead> {
  const lead = await LeadModel.findByIdAndUpdate(id, input, {
    new: true, // Return the updated document
    runValidators: true, // Enforce schema validators on update
  }).lean()

  if (!lead) throw ApiError.notFound(`Lead with id '${id}' not found`)
  return lead as unknown as ILead
}

export async function deleteLead(id: string): Promise<void> {
  const result = await LeadModel.findByIdAndDelete(id)
  if (!result) throw ApiError.notFound(`Lead with id '${id}' not found`)
}
