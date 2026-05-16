import type { Response } from 'express'
import type { ApiResponse } from '@leadflow/shared'

/**
 * Builds and sends a consistent JSON response envelope.
 * Controllers should use this instead of calling res.json() directly
 * to guarantee response shape uniformity.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  }
  res.status(statusCode).json(response)
}

/** Convenience wrapper for 201 Created responses */
export function sendCreated<T>(res: Response, data: T, message = 'Created'): void {
  sendSuccess(res, data, message, 201)
}
