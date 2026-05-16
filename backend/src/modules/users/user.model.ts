import mongoose, { type Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { UserRole } from '@leadflow/shared'
import { env } from '../../config/env'

/**
 * Mongoose document shape for a User.
 * Extends IUser (from shared) with the password hash field and a helper method.
 * The password is never returned in API responses — enforce via .select('-passwordHash').
 */
export interface IUserDocument extends Document {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  /** Compares a plain-text candidate against the stored bcrypt hash */
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Excluded from query results by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Sales,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // Never expose the password hash in serialized output
    toJSON: {
      transform(_doc, ret) {
        // Assign undefined rather than delete to satisfy exactOptionalPropertyTypes
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ;(ret as Record<string, unknown>)['passwordHash'] = undefined
        return ret
      },
    },
  }
)

/** Hash the password before saving if it has been modified */
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, env.BCRYPT_SALT_ROUNDS)
  next()
})

userSchema.methods['comparePassword'] = async function (
  this: IUserDocument,
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash)
}

export const UserModel = mongoose.model<IUserDocument>('User', userSchema)
