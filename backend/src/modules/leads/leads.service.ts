import mongoose from 'mongoose'
import { LeadModel, type ILeadDocument } from './lead.model'
import { ApiError } from '../../utils/ApiError'
import type { CreateLeadInput, UpdateLeadInput, LeadQuery } from './leads.schema'
import { LeadStatus, LeadSource, UserRole } from '@leadflow/shared'

/**
 * Helper to construct the dynamic MongoDB query filter based on request query parameters
 * and User Role-Based Access Control (RBAC) rules.
 * 
 * 1. Checks if status parameter is provided and assigns it directly to query.status
 * 2. Checks if source parameter is provided and assigns it directly to query.source
 * 3. Checks if search parameter is provided and creates a case-insensitive regex pattern
 *    to partial-match either the "name" or the "email" field using $or operator.
 * 4. Checks the user's role:
 *    - If the user's role is 'sales', we add a createdBy restriction to filter for their own leads.
 *    - If the user's role is 'admin', we do not restrict by createdBy (granting view of all leads).
 */
function buildLeadsFilter(
  query: Partial<LeadQuery>,
  userId: string,
  userRole: UserRole
): Record<string, any> {
  const { status, source, search } = query
  const filter: Record<string, any> = {}

  if (status) {
    filter.status = status
  }
  
  if (source) {
    filter.source = source
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i')
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex }
    ]
  }

  // RBAC Filter Rules
  if (userRole === UserRole.Sales) {
    filter.createdBy = new mongoose.Types.ObjectId(userId)
  }

  return filter
}

/**
 * Creates a new lead in the system.
 */
export async function createLead(data: CreateLeadInput, createdBy: string): Promise<ILeadDocument> {
  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    throw ApiError.badRequest('Invalid creator user ID format')
  }

  if (data.assignedTo && !mongoose.Types.ObjectId.isValid(data.assignedTo)) {
    throw ApiError.badRequest('Invalid assigned user ID format')
  }

  const newLead = await LeadModel.create({
    ...data,
    createdBy: new mongoose.Types.ObjectId(createdBy),
    assignedTo: data.assignedTo ? new mongoose.Types.ObjectId(data.assignedTo) : undefined,
  })

  return newLead
}

/**
 * Explains filter-building logic step by step.
 * 
 * Step 1: Validate input parameters and sanitize query criteria.
 * Step 2: Build the dynamic mongoose query filter using `buildLeadsFilter`.
 * Step 3: Determine sort sequence based on `sortBy` parameter ('latest' -> newest first, 'oldest' -> oldest first).
 * Step 4: Apply Skip/Limit offset pagination boundaries using standard formulas.
 * Step 5: Run parallel find and count queries using `Promise.all` for optimal throughput.
 * Step 6: Return result set with standardized pagination metadata envelopes.
 */
export async function getLeads(
  query: LeadQuery,
  userId: string,
  userRole: UserRole
): Promise<{ leads: ILeadDocument[]; total: number; page: number; limit: number; totalPages: number }> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid user ID format')
  }

  const { page, limit, sortBy } = query
  const filter = buildLeadsFilter(query, userId, userRole)

  // Sort parameters configuration
  const sortOrder: Record<string, 1 | -1> = {
    createdAt: sortBy === 'latest' ? -1 : 1
  }

  const skip = (page - 1) * limit

  const [leads, total] = await Promise.all([
    LeadModel.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean(),
    LeadModel.countDocuments(filter),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    leads: leads as unknown as ILeadDocument[],
    total,
    page,
    limit,
    totalPages,
  }
}

/**
 * Resolves a lead by its Mongo ID.
 * Enforces ownership checks on Sales accounts.
 */
export async function getLeadById(
  id: string,
  userId: string,
  userRole: UserRole
): Promise<ILeadDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid lead ID format')
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid user ID format')
  }

  const lead = await LeadModel.findById(id)
  if (!lead) {
    throw ApiError.notFound(`Lead with id '${id}' not found`)
  }

  // RBAC Authorization check
  if (userRole === UserRole.Sales && lead.createdBy.toString() !== userId) {
    throw ApiError.forbidden('You do not have permission to access this lead')
  }

  return lead
}

/**
 * Updates an existing lead by applying partial changes.
 * Enforces identical ownership restrictions to getLeadById.
 */
export async function updateLead(
  id: string,
  data: UpdateLeadInput,
  userId: string,
  userRole: UserRole
): Promise<ILeadDocument> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid lead ID format')
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid user ID format')
  }

  if (data.assignedTo && !mongoose.Types.ObjectId.isValid(data.assignedTo)) {
    throw ApiError.badRequest('Invalid assigned user ID format')
  }

  const lead = await LeadModel.findById(id)
  if (!lead) {
    throw ApiError.notFound(`Lead with id '${id}' not found`)
  }

  // RBAC Authorization check
  if (userRole === UserRole.Sales && lead.createdBy.toString() !== userId) {
    throw ApiError.forbidden('You do not have permission to update this lead')
  }

  const updatedLead = await LeadModel.findByIdAndUpdate(
    id,
    {
      ...data,
      assignedTo: data.assignedTo ? new mongoose.Types.ObjectId(data.assignedTo) : undefined,
    },
    { new: true, runValidators: true }
  )

  if (!updatedLead) {
    throw ApiError.notFound(`Lead with id '${id}' not found`)
  }

  return updatedLead
}

/**
 * Deletes a lead by its Mongo ID.
 * Admins can delete any lead. Sales users can only delete their own.
 */
export async function deleteLead(
  id: string,
  userId: string,
  userRole: UserRole
): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid lead ID format')
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid user ID format')
  }

  const lead = await LeadModel.findById(id)
  if (!lead) {
    throw ApiError.notFound(`Lead with id '${id}' not found`)
  }

  // RBAC Authorization check
  if (userRole === UserRole.Sales) {
    if (lead.createdBy.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to delete this lead')
    }
  } else if (userRole !== UserRole.Admin) {
    throw ApiError.forbidden('Only administrators have permissions to perform this action')
  }

  await LeadModel.findByIdAndDelete(id)
}

/**
 * Fetches all matched records (capped at 10,000 maximum) and exports them in CSV format.
 * Commas, double quotes, and newlines in fields are correctly escaped.
 */
export async function exportLeadsAsCsv(
  query: Omit<LeadQuery, 'page' | 'limit'>,
  userId: string,
  userRole: UserRole
): Promise<string> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest('Invalid user ID format')
  }

  const filter = buildLeadsFilter(query, userId, userRole)

  // Fetch up to 10,000 records lean for performance
  const leads = await LeadModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(10000)
    .lean()

  const csvRows = ['Name,Email,Status,Source,Created At']

  // CSV Field Escaping Helper Function
  const escapeCsvField = (val: unknown): string => {
    if (val === null || val === undefined) return ''
    const str = String(val).trim()
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  for (const lead of leads) {
    const name = escapeCsvField(lead.name)
    const email = escapeCsvField(lead.email)
    const status = escapeCsvField(lead.status)
    const source = escapeCsvField(lead.source)
    const createdAt = lead.createdAt instanceof Date ? lead.createdAt.toISOString() : new Date(lead.createdAt).toISOString()

    csvRows.push(`${name},${email},${status},${source},${createdAt}`)
  }

  return csvRows.join('\r\n')
}
