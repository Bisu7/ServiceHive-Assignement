import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

export interface DropdownOption {
  label: string
  value: string
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={cn('relative w-full flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full bg-obsidian-600 border border-white/[0.05] rounded-lg text-slate-100 text-sm py-2.5 px-4 flex items-center justify-between transition-all duration-200 outline-none text-left',
          isOpen ? 'border-accent ring-1 ring-accent' : 'hover:border-white/[0.12]',
          error && 'border-rose-500/50 focus:border-rose-500'
        )}
      >
        <span className={cn(!selectedOption && 'text-slate-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-obsidian-700 border border-white/[0.08] rounded-lg shadow-xl py-1.5 max-h-60 overflow-y-auto transition-all duration-200">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-slate-500">No options available</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm transition-colors text-slate-300 hover:text-white hover:bg-white/[0.04]',
                  opt.value === value && 'text-accent hover:text-accent font-semibold bg-accent/5'
                )}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}

      {error && <span className="text-xs font-medium text-rose-400">{error}</span>}
    </div>
  )
}

export default Dropdown
