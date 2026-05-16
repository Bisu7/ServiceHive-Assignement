import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { env } from '../../config/env'
import type { UserRole } from '@leadflow/shared'

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUserDocument extends Document {
  name: string
  email: string
  password?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

/**
 * Interface for the User static methods.
 */
interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales' as UserRole,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
)

/**
 * Hash password before saving if it has been modified.
 */
userSchema.pre('save', async function (next) {
  // Cast this to any or IUserDocument to access password
  const user = this as any
  if (!user.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS)
    user.password = await bcrypt.hash(user.password as string, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

/**
 * Compares a candidate password with the stored hash.
 */
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  // Cast this to any to access the password field which might be hidden by select: false
  const user = this as any
  return bcrypt.compare(candidate, user.password || '')
}

/**
 * Static method to find a user by email and explicitly select the password field.
 */
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).select('+password')
}

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema)
