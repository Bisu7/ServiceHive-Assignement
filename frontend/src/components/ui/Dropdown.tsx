import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DropdownOption {
  label: string
  value: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  id: string
}

/**
 * Custom dropdown select with keyboard navigation and click-outside close.
 * Used for filter selects where native <select> styling is insufficient.
 */
export function Dropdown({ options, value, onChange, placeholder = 'Select…', label, id }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center justify-between rounded-lg border border-white/10 bg-surface-800 px-3.5 py-2.5 text-sm',
          'transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-500',
          selectedOption ? 'text-slate-100' : 'text-slate-500'
        )}
      >
        {selectedOption?.label ?? placeholder}
        <ChevronDown className={cn('ml-2 h-4 w-4 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-white/10 bg-surface-800 shadow-xl animate-fade-in"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => { onChange(option.value); setIsOpen(false) }}
              className={cn(
                'cursor-pointer px-3.5 py-2.5 text-sm transition-colors',
                option.value === value
                  ? 'bg-brand-500/20 text-brand-300'
                  : 'text-slate-300 hover:bg-white/5'
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
