import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { ApiError } from '../utils/ApiError'

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const target = source === 'query' ? req.query : source === 'params' ? req.params : req.body
      const parsed = await schema.parseAsync(target)
      
      if (source === 'query') {
        req.query = parsed as any
      } else if (source === 'params') {
        req.params = parsed as any
      } else {
        req.body = parsed
      }
      
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
