import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../modules/auth/auth.service'
import { ApiError } from '../utils/ApiError'
import { User } from '../modules/users/user.model'
import { asyncHandler } from '../utils/asyncHandler'
import type { UserRole } from '@leadflow/shared'

/**
 * Middleware to protect routes and ensure the user is authenticated.
 * Extracts the Bearer token, verifies it, and attaches the user payload to req.user.
 * @throws {ApiError} 401 if token is missing, invalid, or user no longer exists.
 */
export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized to access this route. Please log in.')
  }

  // Verify token
  const decoded = AuthService.verifyToken(token)

  // Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    throw ApiError.unauthorized('The user belonging to this token no longer exists.')
  }

  // Grant access to protected route
  req.user = {
    id: currentUser.id,
    role: currentUser.role as UserRole,
  }
  
  next()
})

/**
 * Middleware factory to restrict access to specific user roles.
 * Must be used AFTER the protect middleware.
 * @param roles Array of allowed UserRoles.
 * @throws {ApiError} 403 if the user's role is not included in the allowed roles.
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden('You do not have permission to perform this action')
      )
    }
    next()
  }
}
