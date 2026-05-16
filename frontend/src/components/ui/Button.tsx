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
  /** Support for polymorphic 'as' prop */
  as?: React.ElementType
  /** Needed for Link components etc */
  to?: string
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.98]',
  secondary: 'bg-surface-800 hover:bg-surface-700 text-slate-200 border border-white/[0.08] shadow-sm active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-white/[0.04] text-slate-400 hover:text-slate-200',
  danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:scale-[0.98]',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
}

/** Accessible, polymorphic button with refined, tactile styling */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, children, className, as: Component = 'button', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2.5 font-semibold tracking-tight transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
          'disabled:cursor-not-allowed disabled:opacity-40',
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
