import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { env } from '../config/env'
import { logger } from '../utils/logger'

export const errorMiddleware = (
  err: any, // Using any here because Express error middleware is broad, but we handle specific types
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err

  // Convert non-ApiError instances to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500)
    const message = error.message || 'Something went wrong'
    
    // Handle specific MongoDB/Mongoose errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]
      error = ApiError.conflict(`Duplicate value for field: ${field}`)
    } else if (err.name === 'CastError') {
      error = ApiError.notFound(`Resource not found with id: ${err.value}`)
    } else {
      error = new ApiError(statusCode, message, false, undefined, err.stack)
    }
  }

  const response = {
    success: false,
    message: error.message,
    data: null,
    timestamp: new Date().toISOString(),
    ...(error.errors && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  }

  // Log error for internal tracking
  if (!error.isOperational) {
    logger.error(`[${req.method}] ${req.path} >> ${error.message}`, error)
  }

  res.status(error.statusCode || 500).json(response)
}
