import React, { useEffect } from 'react'
import { AppRouter } from './router'
import { useAuthStore } from './store/authStore'

export default function App() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return <AppRouter />
}
