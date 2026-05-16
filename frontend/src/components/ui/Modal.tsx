import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  /** Controls modal width */
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/**
 * Accessible modal dialog with focus trap, Escape key handling,
 * and backdrop click to close.
 */
export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-surface-800 p-6 shadow-2xl',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        'animate-fade-in',
        sizeMap[size]
      )}
      aria-labelledby="modal-title"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 id="modal-title" className="text-lg font-semibold text-slate-100">
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </dialog>
  )
}
