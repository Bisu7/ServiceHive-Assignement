import type { Request, Response, RequestHandler } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { ApiResponse } from '../../utils/ApiResponse'
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsAsCsv,
} from './leads.service'
import type { CreateLeadInput, UpdateLeadInput, LeadQuery } from './leads.schema'

interface LeadsController {
  getAll: RequestHandler
  getOne: RequestHandler
  create: RequestHandler
  update: RequestHandler
  remove: RequestHandler
  exportLeads: RequestHandler
}

export const leadsController: LeadsController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as LeadQuery
    const { leads, total, page, limit, totalPages } = await getLeads(
      query,
      req.user.id,
      req.user.role
    )

    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }

    return res
      .status(200)
      .json(ApiResponse.paginated(leads, pagination, 'Leads retrieved successfully'))
  }),

  exportLeads: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as LeadQuery
    const csvContent = await exportLeadsAsCsv(query, req.user.id, req.user.role)

    const today = new Date().toISOString().split('T')[0]
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="leads-${today}.csv"`)

    return res.status(200).send(csvContent)
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const lead = await getLeadById(req.params['id'] as string, req.user.id, req.user.role)
    return res.status(200).json(ApiResponse.ok(lead, 'Lead retrieved successfully'))
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const lead = await createLead(req.body as CreateLeadInput, req.user.id)
    return res.status(201).json(ApiResponse.created(lead, 'Lead created successfully'))
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const lead = await updateLead(
      req.params['id'] as string,
      req.body as UpdateLeadInput,
      req.user.id,
      req.user.role
    )
    return res.status(200).json(ApiResponse.ok(lead, 'Lead updated successfully'))
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await deleteLead(req.params['id'] as string, req.user.id, req.user.role)
    return res.status(200).json(ApiResponse.ok(null, 'Lead deleted successfully'))
  }),
}
