import mongoose from 'mongoose'
import { env } from './env'
import { logger } from '../utils/logger'

/**
 * Establishes the MongoDB connection using Mongoose.
 * Exits the process on failure — a DB-less API server has no purpose.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI, {
      // Emit events on connection issues to enable proper logging
      serverSelectionTimeoutMS: 5000,
    })
    logger.info(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (error) {
    logger.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

/** Gracefully close the database connection (used in test teardown / shutdown hooks) */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close()
  logger.info('MongoDB connection closed')
}
