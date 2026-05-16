import type { Request, Response, NextFunction } from 'express'

/**
 * Wraps an async route handler to forward any thrown errors to Express's next() function.
 * This eliminates the need for repeated try/catch blocks in every controller.
 * 
 * @template T The expected type of the response body.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
