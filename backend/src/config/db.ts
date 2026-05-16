import mongoose from 'mongoose'
import { env } from './env'
import { logger } from '../utils/logger'

export async function connectDB(): Promise<void> {
  const maxAttempts = 3
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      attempts++
      await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      logger.info('✅ MongoDB connected successfully')
      return
    } catch (error) {
      logger.error(`❌ MongoDB connection attempt ${attempts} failed:`, error)
      if (attempts >= maxAttempts) {
        logger.error('CRITICAL: Max MongoDB connection attempts reached. Exiting...')
        process.exit(1)
      }
      // Wait 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}

// Log connection lifecycle events
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error event:', err)
})

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected event')
})

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established')
})
