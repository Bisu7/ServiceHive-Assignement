/**
 * Structured API error class that carries an HTTP status code alongside the message.
 * Use this to throw operational errors that should be returned to the client.
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly errors?: Record<string, string>[]

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    errors?: Record<string, string>[],
    stack = ''
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errors = errors
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /** 400 — Bad Request */
  static badRequest(message: string, errors?: Record<string, string>[]): ApiError {
    return new ApiError(400, message, true, errors)
  }

  /** 401 — Unauthorized */
  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message)
  }

  /** 403 — Forbidden */
  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, message)
  }

  /** 404 — Not Found */
  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message)
  }

  /** 409 — Conflict */
  static conflict(message: string): ApiError {
    return new ApiError(409, message)
  }

  /** 500 — Internal Server Error */
  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message, false)
  }
}
