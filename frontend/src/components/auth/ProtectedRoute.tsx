import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from 'react-hot-toast'

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'sales')[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, token, user } = useAuthStore()

  // Full-page Spinner while session is restoring
  if (token && !user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-obsidian-800 text-accent gap-4">
        <Spinner size="lg" />
        <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Restoring Session...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    toast.error('Access denied: Unauthorized role credentials.')
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
