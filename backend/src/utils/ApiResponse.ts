export class ApiResponse<T> {
  public readonly success: boolean
  public readonly message: string
  public readonly data: T
  public readonly timestamp: string
  public readonly meta?: Record<string, unknown>
  public readonly pagination?: unknown

  constructor(
    success: boolean,
    message: string,
    data: T,
    meta?: Record<string, unknown>,
    pagination?: unknown
  ) {
    this.success = success
    this.message = message
    this.data = data
    this.timestamp = new Date().toISOString()
    if (meta) this.meta = meta
    if (pagination) this.pagination = pagination
  }

  static ok<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data)
  }

  static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return new ApiResponse(true, message, data)
  }

  static paginated<T>(data: T, pagination: unknown, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data, undefined, pagination)
  }
}
