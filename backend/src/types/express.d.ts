import type { UserRole } from '@leadflow/shared'

/**
 * Augments the Express Request interface to include the authenticated user payload.
 * This is set by the authenticate() middleware after token verification.
 */
declare global {
  namespace Express {
    interface Request {
      /** Present on all routes that pass through the authenticate() middleware */
      user?: {
        userId: string
        role: UserRole
      }
    }
  }
}

export {}
