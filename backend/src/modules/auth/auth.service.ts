import jwt from 'jsonwebtoken'
import { User } from '../users/user.model'
import { env } from '../../config/env'
import { ApiError } from '../../utils/ApiError'
import type { RegisterInput, LoginInput } from './auth.schema'

/**
 * Service handling core authentication logic.
 */
export class AuthService {
  /**
   * Registers a new user and generates an authentication token.
   * @throws {ApiError} 409 if email is already taken.
   */
  static async register(data: RegisterInput) {
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      throw ApiError.conflict('A user with this email already exists')
    }

    const user = await User.create(data)
    
    // Remove password from returned object
    const userObj = user.toObject()
    delete userObj.password

    const token = this.generateToken(user.id, user.role)
    return { user: userObj, token }
  }

  /**
   * Authenticates a user and generates a token.
   * @throws {ApiError} 401 if credentials are invalid.
   */
  static async login(data: LoginInput) {
    const user = await User.findByEmail(data.email)
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    const isMatch = await user.comparePassword(data.password)
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password')
    }

    const token = this.generateToken(user.id, user.role)
    
    const userObj = user.toObject()
    delete userObj.password

    return { user: userObj, token }
  }

  /**
   * Generates a signed JWT for the user.
   */
  static generateToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    })
  }

  /**
   * Verifies a JWT and returns the decoded payload.
   * @throws {ApiError} 401 if token is invalid or expired.
   */
  static verifyToken(token: string): { id: string; role: string } {
    try {
      return jwt.verify(token, env.JWT_SECRET) as { id: string; role: string }
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired authentication token')
    }
  }
}
