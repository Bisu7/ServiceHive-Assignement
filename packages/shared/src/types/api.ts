/**
 * Generic API contract shapes used for all HTTP responses.
 * Using a generic wrapper ensures every endpoint returns a consistent envelope.
 */

/** Standard non-paginated API response envelope */
export interface ApiResponse<T> {
  readonly success: boolean
  readonly message: string
  readonly data: T
  /** ISO 8601 timestamp of when the response was generated */
  readonly timestamp: string
}

/** Error response shape — data is null on failure */
export interface ApiErrorResponse {
  readonly success: false
  readonly message: string
  readonly data: null
  readonly statusCode: number
  /** Field-level validation errors keyed by field name */
  readonly errors?: Record<string, string>
  readonly timestamp: string
}

/** Paginated response extends the standard envelope with pagination metadata */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly totalPages: number
    readonly hasNextPage: boolean
    readonly hasPrevPage: boolean
  }
}
