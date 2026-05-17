import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../middleware/validate.middleware'
import { registerSchema, loginSchema } from './auth.schema'
import { protect } from '../../middleware/auth.middleware'
import { authLimiter } from '../../middleware/rateLimit.middleware'

const router: Router = Router()

// Apply auth rate limiting to all auth routes
router.use(authLimiter)

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validate(registerSchema), AuthController.register)

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/login', validate(loginSchema), AuthController.login)

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', protect, AuthController.getMe)

/**
 * @route POST /api/auth/logout
 * @desc Logout current user
 * @access Private
 */
router.post('/logout', protect, AuthController.logout)

export const authRouter: Router = router
