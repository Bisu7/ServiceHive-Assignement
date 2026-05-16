import type { UserRole } from '@leadflow/shared'

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string
        role: UserRole
      }
    }
  }
}
