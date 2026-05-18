import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../middleware/validate.middleware'
import { registerSchema, loginSchema } from './auth.schema'
import { protect } from '../../middleware/auth.middleware'
import { authLimiter } from '../../middleware/rateLimit.middleware'

const router: Router = Router()

// Apply auth rate limiting to all auth routes
router.use(authLimiter)

// POST /register
router.post('/register', validate(registerSchema), AuthController.register)

// POST /login
router.post('/login', validate(loginSchema), AuthController.login)

// GET /me
router.get('/me', protect, AuthController.getMe)

// POST /logout
router.post('/logout', protect, AuthController.logout)

export const authRouter: Router = router
