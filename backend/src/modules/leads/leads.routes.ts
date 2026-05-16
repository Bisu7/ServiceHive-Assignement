import { Router, type IRouter } from 'express'
import { leadsController } from './leads.controller'
import { validate } from '../../middleware/validate.middleware'
import { authenticate } from '../../middleware/auth.middleware'
import { createLeadSchema, updateLeadSchema } from './leads.schema'

const router: IRouter = Router()

/** All leads routes require authentication */
router.use(authenticate)

router.get('/', leadsController.getAll)
router.post('/', validate(createLeadSchema), leadsController.create)
router.get('/:id', leadsController.getOne)
router.patch('/:id', validate(updateLeadSchema), leadsController.update)
router.delete('/:id', leadsController.remove)

export { router as leadsRouter }
