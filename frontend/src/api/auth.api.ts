import { apiClient } from './client'
import type { IUser, LoginPayload, RegisterPayload, AuthResponse, ApiResponse } from '@leadflow/shared'

export async function login(data: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data)
  return res.data.data
}

export async function register(data: RegisterPayload): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data)
  return res.data.data
}

export async function getMe(): Promise<IUser> {
  const res = await apiClient.get<ApiResponse<IUser>>('/auth/me')
  return res.data.data
}

export async function logout(): Promise<void> {
  await apiClient.post<ApiResponse<null>>('/auth/logout')
}
