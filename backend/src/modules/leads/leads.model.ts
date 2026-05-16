import mongoose, { type Document, Schema } from 'mongoose'
import { LeadStatus, LeadSource } from '@leadflow/shared'

/**
 * Mongoose document shape for a Lead.
 * Extends ILead from shared with Mongoose-specific fields.
 */
export interface ILeadDocument extends Document {
  name: string
  email: string
  phone?: string
  company?: string
  status: LeadStatus
  source: LeadSource
  value?: number
  notes?: string
  assignedTo?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    company: { type: String, trim: true, maxlength: 150 },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.New,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      default: LeadSource.Other,
    },
    value: { type: Number, min: 0 },
    notes: { type: String, maxlength: 2000 },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

/** Text index enables full-text search on name, email, and company */
leadSchema.index({ name: 'text', email: 'text', company: 'text' })
/** Compound index for the most common filter combination */
leadSchema.index({ status: 1, source: 1 })

export const LeadModel = mongoose.model<ILeadDocument>('Lead', leadSchema)
