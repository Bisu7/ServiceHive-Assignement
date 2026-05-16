import { Router, type IRouter } from 'express'
import { authController } from './auth.controller'
import { validate } from '../../middleware/validate.middleware'
import { authenticate } from '../../middleware/auth.middleware'
import { authRateLimit } from '../../middleware/rateLimit.middleware'
import { registerSchema, loginSchema } from './auth.schema'

const router: IRouter = Router()

/** Rate limit auth routes to mitigate brute-force attacks */
router.use(authRateLimit)

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.get('/me', authenticate, authController.me)

export { router as authRouter }
