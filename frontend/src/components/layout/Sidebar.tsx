import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/schedule', label: 'Schedule', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
]

/** Sidebar with a clean, vertical navigation layout */
export function Sidebar() {
  const { logout, user } = useAuth()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50/50 px-4 py-8 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-soft">
          <Zap className="h-5 w-5 text-white fill-white" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">LeadFlow</span>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-white text-brand-600 shadow-soft dark:bg-zinc-900 dark:text-brand-400'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
              )
            }
          >
            <Icon className="h-4.5 w-4.5" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User profile + Logout */}
      <div className="mt-auto flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-zinc-800">
        {user && (
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
              {user.name[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <LogOut className="h-4.5 w-4.5" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  )
}
