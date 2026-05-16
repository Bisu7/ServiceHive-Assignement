import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { logger } from '../utils/logger'
import { env } from '../config/env'

/**
 * Global error-handling middleware. Must be registered LAST in the Express
 * middleware chain (after all routes). Normalises ApiError and unexpected
 * errors into the shared ApiErrorResponse shape.
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // next is required by Express's signature even when unused
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      statusCode: err.statusCode,
      errors: err.errors,
      timestamp: new Date().toISOString(),
    })
    return
  }

  // Unexpected error — log full details server-side but hide internals from client
  logger.error('Unhandled error:', err)

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : String(err),
    data: null,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  })
}

/** Handles requests that match no registered route */
export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound('Route not found'))
}
