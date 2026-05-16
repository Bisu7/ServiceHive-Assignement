/**
 * Structured API error class that carries an HTTP status code alongside the message.
 * Throw this instead of plain Error to enable the global error middleware to respond correctly.
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errors: Record<string, string> | undefined

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string>
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors

    // Maintain proper prototype chain in transpiled environments
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  /** 400 — request body failed validation */
  static badRequest(message: string, errors?: Record<string, string>): ApiError {
    return new ApiError(400, message, errors)
  }

  /** 401 — missing or invalid credentials */
  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message)
  }

  /** 403 — authenticated but lacks permission */
  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, message)
  }

  /** 404 — resource does not exist */
  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message)
  }

  /** 409 — state conflict (e.g. duplicate email) */
  static conflict(message: string): ApiError {
    return new ApiError(409, message)
  }

  /** 500 — unexpected server-side failure */
  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message)
  }
}
