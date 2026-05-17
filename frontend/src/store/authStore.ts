import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { IUser } from '@leadflow/shared'
import { apiClient } from '@/api/client'

interface AuthState {
  user: IUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setAuth: (user: IUser, token: string) => void
  clearAuth: () => void
  fetchCurrentUser: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      fetchCurrentUser: async () => {
        set({ isLoading: true })
        try {
          const res = await apiClient.get<{ success: boolean; data: IUser }>('/auth/me')
          set({
            user: res.data.data,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // silently handle 401
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      initialize: async () => {
        if (get().token) {
          await get().fetchCurrentUser()
        }
      },
    }),
    {
      name: 'leadflow-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
