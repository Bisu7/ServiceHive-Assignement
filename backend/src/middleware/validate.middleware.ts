import type { Request, Response, NextFunction } from 'express'
import { ZodError, type ZodSchema } from 'zod'
import { ApiError } from '../utils/ApiError'

/**
 * Factory that produces a middleware validating req.body against a Zod schema.
 * On validation failure it throws an ApiError.badRequest so the global error
 * handler formats the response consistently.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register)
 */
export function validate(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = (result.error as ZodError).issues.reduce<Record<string, string>>(
        (acc, issue) => {
          const field = issue.path.join('.')
          acc[field] = issue.message
          return acc
        },
        {}
      )
      return next(ApiError.badRequest('Validation failed', errors))
    }

    // Replace req.body with the parsed, coerced value from Zod
    req.body = result.data
    next()
  }
}
