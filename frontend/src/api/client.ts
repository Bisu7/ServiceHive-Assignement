import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string>
}

const apiClient = axios.create({
  baseURL: ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach token directly from store
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401 redirects and transform errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const data = error.response?.data as any

      if (status === 401) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject({
          message: 'Session expired. Please log in again.',
          statusCode: 401,
        } as ApiError)
      }

      const transformedError: ApiError = {
        message: data?.message || error.message || 'An unexpected error occurred.',
        statusCode: status,
        errors: data?.errors,
      }
      return Promise.reject(transformedError)
    }

    return Promise.reject({
      message: error instanceof Error ? error.message : 'Check your connection.',
    } as ApiError)
  }
)

export { apiClient }
