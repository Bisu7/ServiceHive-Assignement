import { z } from 'zod'

/**
 * Zod schema for environment variable validation.
 * Fails at startup if any required variable is missing or malformed,
 * preventing subtle runtime errors from misconfiguration.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().url('MONGO_URI must be a valid connection string'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().url('CLIENT_ORIGIN must be a valid URL').default('http://localhost:5173'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
})

/** Inferred type from the validation schema — use this instead of process.env directly */
export type Env = z.infer<typeof envSchema>

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    // Crash intentionally — a misconfigured app should not silently run
    throw new Error(`Environment validation failed:\n${formatted}`)
  }

  return result.data
}

export const env = parseEnv()
