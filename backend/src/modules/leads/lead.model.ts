import mongoose, { type Document, Schema } from 'mongoose'
import { LeadStatus, LeadSource } from '@leadflow/shared'

export interface ILeadDocument extends Document {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  notes?: string
  assignedTo?: mongoose.Types.ObjectId
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.New,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Lead source is required'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user is required'],
    },
  },
  {
    timestamps: true,
  }
)

// Explicit indexes
leadSchema.index({ status: 1 })
leadSchema.index({ source: 1 })
leadSchema.index({ createdAt: -1 })
leadSchema.index({ name: 'text', email: 'text' })

export const LeadModel = mongoose.model<ILeadDocument>('Lead', leadSchema)
