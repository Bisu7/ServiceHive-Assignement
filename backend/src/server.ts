import { app } from './app'
import { connectDB } from './config/db'
import { env } from './config/env'
import { logger } from './utils/logger'

/**
 * Bootstraps the LeadFlow backend server.
 * Connects to the database and then starts the Express listener.
 */
async function bootstrap() {
  try {
    // 1. Connect to Database with retry logic
    await connectDB()

    // 2. Start Express Server
    const port = env.PORT
    const server = app.listen(port, () => {
      logger.info(`🚀 LeadFlow Server running in ${env.NODE_ENV} mode on port ${port}`)
    })

    // Handle graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down server...')
      server.close(() => {
        logger.info('Server closed')
        process.exit(0)
      })
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

bootstrap()
