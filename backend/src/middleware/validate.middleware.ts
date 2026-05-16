import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { ApiError } from '../utils/ApiError'

/**
 * Middleware factory that validates the request body against a Zod schema.
 * @param schema The Zod schema to validate against.
 * @throws {ApiError} 422 if validation fails, containing field-level error details.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        return next(ApiError.badRequest('Validation failed', formattedErrors))
      }
      next(error)
    }
  }
}
