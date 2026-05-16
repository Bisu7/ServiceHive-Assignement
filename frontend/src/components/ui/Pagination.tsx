import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
}

/** Pagination controls with prev/next buttons and page indicator */
export function Pagination({ page, totalPages, hasNextPage, hasPrevPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between border-t border-white/10 pt-4">
      <p className="text-sm text-slate-400">
        Page <span className="font-medium text-slate-200">{page}</span> of{' '}
        <span className="font-medium text-slate-200">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400',
            'transition-colors hover:bg-white/5 hover:text-slate-200',
            'disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400',
            'transition-colors hover:bg-white/5 hover:text-slate-200',
            'disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
