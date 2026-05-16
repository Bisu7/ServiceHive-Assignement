export class ApiResponse<T> {
  public readonly success: boolean
  public readonly message: string
  public readonly data: T
  public readonly timestamp: string
  public readonly meta?: Record<string, unknown>

  constructor(success: boolean, message: string, data: T, meta?: Record<string, unknown>) {
    this.success = success
    this.message = message
    this.data = data
    this.timestamp = new Date().toISOString()
    this.meta = meta
  }

  static ok<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data)
  }

  static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return new ApiResponse(true, message, data)
  }

  static paginated<T>(data: T, meta: Record<string, unknown>, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data, meta)
  }
}
