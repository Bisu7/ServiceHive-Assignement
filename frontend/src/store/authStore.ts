import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { IUser } from '@leadflow/shared'

interface AuthState {
  token: string | null
  user: IUser | null
  isAuthenticated: boolean
  /** Stores the token and user after a successful login/register */
  setAuth: (token: string, user: IUser) => void
  /** Clears all auth state — used on logout and 401 responses */
  logout: () => void
}

/**
 * Zustand auth store with localStorage persistence.
 * Token is persisted so users remain logged in across browser refreshes.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),

      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'leadflow-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist the token — user can be re-fetched from /auth/me
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
