import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface TopbarProps {
  /** Page title displayed in the topbar */
  title: string
}

/** Top navigation bar showing the current page title and user avatar */
export function Topbar({ title }: TopbarProps) {
  const user = useAuthStore((state) => state.user)

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-surface-900/80 px-6 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div
          aria-label={`User: ${user?.name ?? 'Unknown'}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white"
        >
          {initials ?? '?'}
        </div>
      </div>
    </header>
  )
}
