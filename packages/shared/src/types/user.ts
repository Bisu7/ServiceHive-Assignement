/**
 * User domain types — roles and the public-safe user shape.
 * Passwords are never included in this interface.
 */

export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  Sales = 'sales',
}

/** Public representation of a user — never expose passwordHash via this interface */
export interface IUser {
  readonly _id: string
  name: string
  email: string
  role: UserRole
  /** Whether the account has been email-verified */
  isVerified: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

/** Payload for registering a new user */
export interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: UserRole
}

/** Payload for authenticating an existing user */
export interface LoginPayload {
  email: string
  password: string
}

/** Shape returned after successful authentication */
export interface AuthResponse {
  token: string
  user: IUser
}
