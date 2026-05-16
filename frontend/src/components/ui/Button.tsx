import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant — 'primary' is the default branded action */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Size preset */
  size?: 'sm' | 'md' | 'lg'
  /** Shows a spinner and disables interaction while true */
  isLoading?: boolean
  /** Support for polymorphic 'as' prop (limited to standard elements for simplicity) */
  as?: React.ElementType
  /** Needed for Link components etc */
  to?: string
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20',
  secondary: 'bg-surface-700 hover:bg-slate-600 text-slate-200 border border-white/10',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-300',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

/** Accessible, polymorphic button with variant and loading state support */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, children, className, as: Component = 'button', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-900',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'
