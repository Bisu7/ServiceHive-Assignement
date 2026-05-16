import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined
  error?: string | undefined
  hint?: string | undefined
}

/** Labelled input with high-contrast text and refined border states */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined
    const hintId = hint ? `${id}-hint` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200',
            'bg-slate-50 text-slate-900 placeholder:text-slate-400',
            'dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            error
              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/5 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 hover:border-slate-300 dark:border-zinc-800 dark:hover:border-zinc-700',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs font-medium text-slate-500 dark:text-zinc-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
