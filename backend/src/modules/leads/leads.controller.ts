import type { Request, Response, RequestHandler } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { ApiResponse } from '../../utils/ApiResponse'
import { getLeads, getLeadById, createLead, updateLead, deleteLead } from './leads.service'
import { leadFiltersSchema, type CreateLeadInput, type UpdateLeadInput } from './leads.schema'

/** Strongly-typed shape for the leads controller object */
interface LeadsController {
  getAll: RequestHandler
  getOne: RequestHandler
  create: RequestHandler
  update: RequestHandler
  remove: RequestHandler
}

/**
 * Leads controller — handles HTTP request/response cycle for the leads resource.
 * Delegates all domain logic to leads.service.
 */
export const leadsController: LeadsController = {
  /** GET /api/leads — paginated, filterable list */
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = leadFiltersSchema.parse(req.query)
    const result = await getLeads(filters)
    
    // Extract metadata for the paginated response
    const { data, ...meta } = result
    return res.status(200).json(ApiResponse.paginated(data, meta))
  }),

  /** GET /api/leads/:id — single lead by MongoDB ObjectId */
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const lead = await getLeadById(req.params['id'] as string)
    return res.status(200).json(ApiResponse.ok(lead, 'Lead retrieved successfully'))
  }),

  /** POST /api/leads — create a new lead */
  create: asyncHandler(async (req: Request, res: Response) => {
    const lead = await createLead(req.body as CreateLeadInput)
    return res.status(201).json(ApiResponse.created(lead, 'Lead created successfully'))
  }),

  /** PATCH /api/leads/:id — partial update */
  update: asyncHandler(async (req: Request, res: Response) => {
    const lead = await updateLead(req.params['id'] as string, req.body as UpdateLeadInput)
    return res.status(200).json(ApiResponse.ok(lead, 'Lead updated successfully'))
  }),

  /** DELETE /api/leads/:id — permanent deletion */
  remove: asyncHandler(async (req: Request, res: Response) => {
    await deleteLead(req.params['id'] as string)
    return res.status(200).json(ApiResponse.ok(null, 'Lead deleted successfully'))
  }),
}
