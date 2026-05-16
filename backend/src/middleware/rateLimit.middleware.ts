import rateLimit from 'express-rate-limit'

/**
 * Strict rate limiter for authentication endpoints.
 * Prevents brute-force attacks by limiting login/register attempts.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute rolling window
  max: 10,
  message: 'Too many attempts from this IP. Please try again after 15 minutes.',
  standardHeaders: true, // Return RateLimit-* headers per RFC 6585
  legacyHeaders: false,
})

/**
 * General API rate limiter applied globally to all routes.
 * Protects against denial-of-service and abusive scraping.
 */
export const globalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 100,
  message: 'Too many requests from this IP. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
})
