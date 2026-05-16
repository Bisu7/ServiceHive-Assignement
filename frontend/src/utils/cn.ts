import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx (conditional class resolution) with tailwind-merge (conflict resolution).
 * This is the standard pattern for building dynamic className strings with Tailwind CSS.
 *
 * Example:
 *   cn('px-4 py-2', isActive && 'bg-brand-500', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
