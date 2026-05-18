import express, { Application, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env'
import { authRouter } from './modules/auth/auth.routes'
import { leadsRouter } from './modules/leads/leads.routes'
import { errorMiddleware } from './middleware/error.middleware'
import { apiLimiter } from './middleware/rateLimit.middleware'
import { ApiError } from './utils/ApiError'

const app: Application = express()

app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true)
      
      const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')
      
      callback(null, isAllowed)
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.use('/api', apiLimiter)
app.use('/api/auth', authRouter)
app.use('/api/leads', leadsRouter)

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  })
})

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found on this server`))
})

app.use(errorMiddleware)

export { app }
