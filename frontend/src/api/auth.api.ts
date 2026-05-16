import { apiClient } from './client'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@leadflow/shared'
import type { ApiResponse } from '@leadflow/shared'

/** Registers a new user account */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload)
  return res.data.data
}

/** Authenticates a user and returns a JWT + user profile */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload)
  return res.data.data
}

/** Fetches the currently authenticated user profile */
export async function getMe(): Promise<AuthResponse['user']> {
  const res = await apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/me')
  return res.data.data
}
