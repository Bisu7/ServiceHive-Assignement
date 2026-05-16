export type { ApiResponse, ApiErrorResponse, PaginatedResponse } from '@leadflow/shared'

/** Axios error response body shape — used for typed error handling in catch blocks */
export interface AxiosErrorData {
  success: false
  message: string
  errors?: Record<string, string>
  statusCode: number
}
