import { app } from './app'
import { connectDB } from './config/db'
import { env } from './config/env'
import { logger } from './utils/logger'

async function bootstrap() {
  try {
    await connectDB()

    const port = env.PORT
    const server = app.listen(port, () => {
      logger.info(`🚀 LeadFlow Server running in ${env.NODE_ENV} mode on port ${port}`)
    })

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
