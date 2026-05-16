import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import * as authApi from '@/api/auth.api'
import type { LoginPayload, RegisterPayload } from '@leadflow/shared'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

/**
 * Hook encapsulating all authentication actions.
 * Components should use this hook instead of calling authStore or authApi directly.
 */
export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      setIsLoading(true)
      try {
        const { token: newToken, user: newUser } = await authApi.login(payload)
        setAuth(newToken, newUser)
        toast.success(`Welcome back, ${newUser.name}!`)
        navigate('/')
      } catch {
        toast.error('Invalid email or password')
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
        setAuth(newToken, newUser)
        toast.success(`Welcome to LeadFlow, ${newUser.name}!`)
        navigate('/')
      } catch {
        toast.error('Registration failed. The email may already be in use.')
      } finally {
        setIsLoading(false)
      }
    },
    [setAuth, navigate]
  )

  const logout = useCallback((): void => {
    storeLogout()
    navigate('/login')
    toast.success('Signed out successfully')
  }, [storeLogout, navigate])

  return { user, token, isAuthenticated, isLoading, login, register, logout }
}

/**
 * Initialises auth state on app mount by re-fetching the user profile
 * when a persisted token exists. This validates the token hasn't expired.
 */
export function useAuthInit(): void {
  const { token, setAuth, logout } = useAuthStore()

  useEffect(() => {
    if (!token) return

    authApi.getMe().then((user) => {
      // Re-hydrate user object in case profile changed since last visit
      setAuth(token, user)
    }).catch(() => {
      // Token has expired or been revoked — clear state
      logout()
    })
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
