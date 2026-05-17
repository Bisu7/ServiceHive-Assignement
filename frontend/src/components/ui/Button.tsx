import React from 'react'
import { cn } from '@/utils/cn'
import { Spinner } from './Spinner'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-obsidian-800 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white disabled:bg-accent/40',
    secondary: 'bg-obsidian-600 border border-white/[0.08] hover:border-white/[0.2] text-slate-200 disabled:border-white/[0.03] disabled:text-slate-500',
    ghost: 'bg-transparent hover:bg-white/[0.04] text-slate-400 hover:text-white',
    danger: 'bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 text-rose-400 hover:bg-rose-950/40 disabled:border-rose-950/10 disabled:text-rose-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  }

  const isButtonDisabled = disabled || loading

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={isButtonDisabled}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
