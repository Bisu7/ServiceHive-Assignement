import rateLimit from 'express-rate-limit'
import { ApiError } from '../utils/ApiError'

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests from this IP, please try again after a minute',
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'Too many requests, please try again later'))
  },
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts, please try again after 15 minutes',
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'Too many authentication attempts, please try again after 15 minutes'))
  },
})
