import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@leadflow/shared'

/**
 * Hook to access and compute user permissions reactively from the authStore.
 */
export function usePermissions() {
  const user = useAuthStore((state) => state.user)
  const role = user?.role

  const canDeleteAnyLead = (): boolean => {
    return role === UserRole.Admin
  }

  const canViewAllLeads = (): boolean => {
    return role === UserRole.Admin
  }

  const canExportLeads = (): boolean => {
    return role === UserRole.Admin || role === UserRole.Sales || role === UserRole.Manager
  }

  return {
    user,
    role,
    canDeleteAnyLead,
    canViewAllLeads,
    canExportLeads,
  }
}
