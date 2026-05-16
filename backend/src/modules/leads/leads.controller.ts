import type { Request, Response, RequestHandler } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { ApiResponse } from '../../utils/ApiResponse'
import { getLeads, getLeadById, createLead, updateLead, deleteLead } from './leads.service'
import { leadFiltersSchema, type CreateLeadInput, type UpdateLeadInput } from './leads.schema'

interface LeadsController {
  getAll: RequestHandler
  getOne: RequestHandler
  create: RequestHandler
  update: RequestHandler
  remove: RequestHandler
}

export const leadsController: LeadsController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = leadFiltersSchema.parse(req.query)
    const { leads, pagination } = await getLeads(filters)
    return res.status(200).json(ApiResponse.paginated(leads, { pagination }))
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const lead = await getLeadById(req.params['id'] as string)
    return res.status(200).json(ApiResponse.ok(lead, 'Lead retrieved successfully'))
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const lead = await createLead(req.body as CreateLeadInput)
    return res.status(201).json(ApiResponse.created(lead, 'Lead created successfully'))
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const lead = await updateLead(req.params['id'] as string, req.body as UpdateLeadInput)
    return res.status(200).json(ApiResponse.ok(lead, 'Lead updated successfully'))
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await deleteLead(req.params['id'] as string)
    return res.status(200).json(ApiResponse.ok(null, 'Lead deleted successfully'))
  }),
}
