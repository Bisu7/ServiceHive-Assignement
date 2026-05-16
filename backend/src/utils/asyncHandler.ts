import type { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps an async route handler to forward any thrown errors to Express's
 * next() function, eliminating boilerplate try/catch in every controller.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next)
  }
}
