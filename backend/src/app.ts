import express, { Application, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env'
import { authRouter } from './modules/auth/auth.routes'
import { errorMiddleware } from './middleware/error.middleware'
import { apiLimiter } from './middleware/rateLimit.middleware'
import { ApiError } from './utils/ApiError'

/**
 * Configure the Express application.
 * Integrates security headers, CORS, rate limiting, and core routes.
 */
const app: Application = express()

// 1. GLOBAL SECURITY MIDDLEWARE
app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
)

// 2. PARSING MIDDLEWARE
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// 3. GLOBAL RATE LIMITING
app.use('/api', apiLimiter)

// 4. ROUTES
app.use('/api/auth', authRouter)

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() })
})

// 5. 404 HANDLER
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found on this server`))
})

// 6. GLOBAL ERROR HANDLER
app.use(errorMiddleware)

export { app }
