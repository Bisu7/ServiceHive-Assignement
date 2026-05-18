import { Router } from 'express'
import { leadsController } from './leads.controller'
import { validate } from '../../middleware/validate.middleware'
import { protect } from '../../middleware/auth.middleware'
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from './leads.schema'

const router: Router = Router()

// All leads routes require authentication
router.use(protect)

// GET leads and export (GET routes must use query string validation)
router.get('/', validate(leadQuerySchema, 'query'), leadsController.getAll)
router.get('/export', validate(leadQuerySchema, 'query'), leadsController.exportLeads)

// CREATE lead
router.post('/', validate(createLeadSchema), leadsController.create)

// GET, UPDATE, DELETE individual leads by ObjectId
router.get('/:id', leadsController.getOne)
router.patch('/:id', validate(updateLeadSchema), leadsController.update)
router.delete('/:id', leadsController.remove)

export { router as leadsRouter }
