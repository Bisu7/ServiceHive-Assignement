import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, type = 'text', id, ...props }, ref) => {
    const inputId = id || `input-${label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substring(7)}`

    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-500 pointer-events-none select-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-obsidian-600 border border-white/[0.05] rounded-lg text-slate-100 text-sm py-2.5 transition-all duration-200 outline-none placeholder-slate-500',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'focus:border-accent focus:ring-1 focus:ring-accent',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-slate-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <span className="text-xs font-medium text-rose-400">{error}</span>
        ) : (
          hint && <span className="text-xs text-slate-500">{hint}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
