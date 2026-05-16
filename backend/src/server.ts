import 'dotenv/config'
import { app } from './app'
import { connectDatabase } from './config/db'
import { env } from './config/env'
import { logger } from './utils/logger'

/**
 * Server entry point.
 * Connects to MongoDB first, then starts listening — the API is only available
 * once the database is ready to handle queries.
 */
async function bootstrap(): Promise<void> {
  await connectDatabase()

  const server = app.listen(env.PORT, () => {
    logger.info(`LeadFlow API listening on http://localhost:${env.PORT} [${env.NODE_ENV}]`)
  })

  // Graceful shutdown on SIGTERM (e.g., Docker stop) or SIGINT (Ctrl+C)
  const shutdown = (signal: string): void => {
    logger.info(`${signal} received. Shutting down gracefully...`)
    server.close(() => {
      logger.info('HTTP server closed')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err)
  process.exit(1)
})
