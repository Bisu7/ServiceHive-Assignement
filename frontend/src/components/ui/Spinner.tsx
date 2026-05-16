import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

/** Loading spinner with accessible label */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-brand-400', sizeMap[size], className)}
      aria-label="Loading"
      role="status"
    />
  )
}

/** Full-page centered loading overlay */
export function PageSpinner() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center" role="status" aria-label="Loading page">
      <Spinner size="lg" />
    </div>
  )
}
