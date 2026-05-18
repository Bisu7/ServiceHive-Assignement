// Structured logger wrapping console methods.

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

function formatMessage(level: LogLevel, message: string): string {
  const ts = new Date().toISOString()
  return `[${ts}] [${level.toUpperCase()}] ${message}`
}

export const logger = {
  info(message: string, ...args: unknown[]): void {
    console.info(formatMessage('info', message), ...args)
  },
  warn(message: string, ...args: unknown[]): void {
    console.warn(formatMessage('warn', message), ...args)
  },
  error(message: string, ...args: unknown[]): void {
    console.error(formatMessage('error', message), ...args)
  },
  debug(message: string, ...args: unknown[]): void {
    if (process.env['NODE_ENV'] !== 'production') {
      console.info(formatMessage('debug', message), ...args)
    }
  },
}
