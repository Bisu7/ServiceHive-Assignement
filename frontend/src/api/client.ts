import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

/**
 * Configured Axios instance for all LeadFlow API calls.
 * - baseURL points to the Vite dev proxy (/api) or the production API
 * - Request interceptor attaches the Bearer token if present
 * - Response interceptor handles 401s by clearing auth state
 */
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** Attach JWT from Zustand store to every outgoing request */
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Clear auth state on 401 — redirects user to login on the next render cycle */
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export { apiClient }
