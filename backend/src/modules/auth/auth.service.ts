import jwt from 'jsonwebtoken'
import { ApiError } from '../../utils/ApiError'
import { env } from '../../config/env'
import { UserModel } from '../users/user.model'
import type { RegisterInput, LoginInput } from './auth.schema'
import type { AuthResponse, IUser } from '@leadflow/shared'

/**
 * Auth service — contains all business logic for registration and login.
 * Controllers call these methods and only handle HTTP concerns (status, response).
 */

/** Registers a new user and returns a signed JWT alongside the public user object */
export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const existing = await UserModel.findOne({ email: input.email })
  if (existing) {
    throw ApiError.conflict('An account with this email already exists')
  }

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash: input.password, // Pre-save hook handles hashing
    role: input.role,
  })

  const token = signToken(user.id as string, user.role)
  // Mongoose serialises _id as string via toJSON — cast through unknown is intentional
  const publicUser = user.toJSON() as unknown as IUser

  return { token, user: publicUser }
}

/** Validates credentials and returns a signed JWT on success */
export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  // Explicitly select passwordHash since it's excluded by default
  const user = await UserModel.findOne({ email: input.email }).select('+passwordHash')

  if (!user) {
    // Use the same message for missing user and wrong password to prevent enumeration
    throw ApiError.unauthorized('Invalid email or password')
  }

  const isMatch = await user.comparePassword(input.password)
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const token = signToken(user.id as string, user.role)
  // Mongoose serialises _id as string via toJSON — cast through unknown is intentional
  const publicUser = user.toJSON() as unknown as IUser

  return { token, user: publicUser }
}

/** Creates a signed JWT for the given user */
function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}
