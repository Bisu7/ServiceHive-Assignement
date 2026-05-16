import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { asyncHandler } from '../../utils/asyncHandler'
import { ApiResponse } from '../../utils/ApiResponse'
import { User } from '../users/user.model'
import { ApiError } from '../../utils/ApiError'

/**
 * Controller handling authentication-related HTTP requests.
 */
export class AuthController {
  /**
   * Registers a new user account.
   * POST /api/auth/register
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body)
    
    return res.status(201).json(
      ApiResponse.created(result, 'Account created successfully')
    )
  })

  /**
   * Logs into an existing user account.
   * POST /api/auth/login
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body)
    
    return res.status(200).json(
      ApiResponse.ok(result, 'Logged in successfully')
    )
  })

  /**
   * Returns the current authenticated user's profile.
   * GET /api/auth/me
   */
  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user.id)
    if (!user) {
      throw ApiError.notFound('User profile not found')
    }

    return res.status(200).json(
      ApiResponse.ok(user, 'User profile retrieved')
    )
  })

  /**
   * Logs out the current user.
   * POST /api/auth/logout
   */
  static logout = asyncHandler(async (_req: Request, res: Response) => {
    // In a stateless JWT system, logout is primarily handled on the client by deleting the token.
    // This endpoint is kept for consistency and future cookie-clearing if added.
    return res.status(200).json(
      ApiResponse.ok(null, 'Logged out successfully')
    )
  })
}
