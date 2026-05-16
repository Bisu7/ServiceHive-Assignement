import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError'
import { env } from '../config/env'
import type { UserRole } from '@leadflow/shared'

/** Shape of the JWT payload we sign at login */
interface JwtPayload {
  userId: string
  role: UserRole
  iat: number
  exp: number
}

/**
 * Verifies the Bearer token from the Authorization header and attaches
 * the decoded payload to req.user for downstream handlers.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or malformed Authorization header'))
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    req.user = { userId: payload.userId, role: payload.role }
    next()
  } catch {
    next(ApiError.unauthorized('Token is invalid or expired'))
  }
}

/**
 * Role-based access control guard. Must be used after authenticate().
 * Accepts a list of roles that are permitted to proceed.
 */
export function authorize(
  ...allowedRoles: UserRole[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized())
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'))
    }

    next()
  }
}
