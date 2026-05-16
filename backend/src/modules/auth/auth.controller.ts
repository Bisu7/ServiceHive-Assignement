import type { Request, Response, RequestHandler } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { sendSuccess, sendCreated } from '../../utils/ApiResponse'
import { registerUser, loginUser } from './auth.service'
import type { RegisterInput, LoginInput } from './auth.schema'

/** Strongly-typed shape for the auth controller object */
interface AuthController {
  register: RequestHandler
  login: RequestHandler
  me: RequestHandler
}

/**
 * Auth controller — thin layer that delegates to the auth service and
 * formats HTTP responses. No business logic should live here.
 */
export const authController: AuthController = {
  /**
   * POST /api/auth/register
   * Creates a new user account and returns a JWT.
   */
  register: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await registerUser(req.body as RegisterInput)
    sendCreated(res, result, 'Account created successfully')
  }),

  /**
   * POST /api/auth/login
   * Authenticates credentials and returns a JWT.
   */
  login: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await loginUser(req.body as LoginInput)
    sendSuccess(res, result, 'Login successful')
  }),

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user (token already verified by middleware).
   */
  me: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, req.user, 'Authenticated user retrieved')
  }),
}
