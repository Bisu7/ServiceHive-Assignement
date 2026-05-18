import { useCallback, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import * as authApi from '@/api/auth.api'
import type { LoginPayload, RegisterPayload } from '@leadflow/shared'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// Hook encapsulating all authentication actions.
export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      setIsLoading(true)
      try {
        const { token: newToken, user: newUser } = await authApi.login(payload)
        setAuth(newUser, newToken)
        toast.success(`Welcome back, ${newUser.name}!`)
        navigate('/dashboard')
      } catch (err: any) {
        toast.error(err.message || 'Invalid email or password')
      } finally {
        setIsLoading(false)
      }
    },
    [setAuth, navigate]
  )

  const register = useCallback(
    async (payload: RegisterPayload): Promise<void> => {
      setIsLoading(true)
      try {
        const { token: newToken, user: newUser } = await authApi.register(payload)
        setAuth(newUser, newToken)
        toast.success(`Welcome to GigFlow, ${newUser.name}!`)
        navigate('/dashboard')
      } catch (err: any) {
        toast.error(err.message || 'Registration failed. Email may already be in use.')
      } finally {
        setIsLoading(false)
      }
    },
    [setAuth, navigate]
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch (err) {
      // ignore logout endpoint errors
    } finally {
      clearAuth()
      navigate('/login')
      toast.success('Signed out successfully')
    }
  }, [clearAuth, navigate])

  return { user, token, isAuthenticated, isLoading, login, register, logout }
}
