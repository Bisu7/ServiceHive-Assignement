/**
 * Re-exports of @leadflow/shared types used server-side.
 * Import from here within the server package for cleaner paths.
 */
export type {
  ILead,
  IUser,
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
  RegisterPayload,
  LoginPayload,
  AuthResponse,
} from '@leadflow/shared'

export { LeadStatus, LeadSource, UserRole } from '@leadflow/shared'
