import { Bell, Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface TopbarProps {
  title: string
}

/** Dashboard top bar with page title, search, notifications, and theme toggle */
export function Topbar({ title }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-focus focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          />
        </div>
        
        <ThemeToggle />
        
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
