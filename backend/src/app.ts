import express, { type Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { globalRateLimit } from './middleware/rateLimit.middleware'
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware'
import { authRouter } from './modules/auth/auth.routes'
import { leadsRouter } from './modules/leads/leads.routes'
import { env } from './config/env'

/** Configured Express application — exported without listening for testability */
const app: Application = express()

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet())

// ── CORS — restrict to the configured client origin ──────────────────────────
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  })
)

// ── Global rate limiting ──────────────────────────────────────────────────────
app.use(globalRateLimit)

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── Health check — lightweight endpoint for load balancers ────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'leadflow-api', timestamp: new Date().toISOString() })
})

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/leads', leadsRouter)

// ── 404 handler — must be after all routes ────────────────────────────────────
app.use(notFoundMiddleware)

// ── Global error handler — must be the last middleware ────────────────────────
app.use(errorMiddleware)

export { app }
