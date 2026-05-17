import React from 'react'
import { cn } from '@/utils/cn'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-between border-t border-white/[0.05] pt-4 mt-4 w-full">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-slate-500 font-mono">
                ...
              </span>
            )
          }

          const isCurrent = page === currentPage

          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'min-w-[32px] h-8 px-2 rounded-lg text-sm font-semibold transition-all duration-200 font-mono',
                isCurrent
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-obsidian-700 border border-white/[0.05] hover:border-white/[0.2] text-slate-300 hover:text-white'
              )}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  )
}

export default Pagination
