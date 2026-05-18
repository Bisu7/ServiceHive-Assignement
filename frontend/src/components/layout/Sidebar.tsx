import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutStore } from '@/store/layoutStore'

export function Sidebar() {
  const { user, logout } = useAuth()
  const { isCollapsed, toggleCollapsed, isMobileOpen } = useLayoutStore()
  const isAdmin = user?.role === 'admin'

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/leads', label: 'Leads', icon: Users },
    ...(isAdmin ? [{ to: '/users', label: 'Users', icon: UserCheck }] : []),
  ]

  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-obsidian-700 border-r border-white/[0.05] transition-all duration-300 z-40 fixed lg:static',
        isCollapsed ? 'w-16' : 'w-[220px]',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-white font-bold">GF</div>
          {!isCollapsed && <span className="font-semibold text-lg text-white truncate">GigFlow</span>}
        </div>
        {!isCollapsed && (
          <button onClick={toggleCollapsed} className="text-slate-400 hover:text-white hidden lg:flex p-1 rounded hover:bg-white/[0.04]" aria-label="Collapse sidebar">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 py-2 px-3 text-sm font-semibold rounded-lg border-l-[3px] border-l-transparent transition-all duration-200',
                isActive ? 'bg-accent/10 border-l-accent text-white' : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
              )
            }
          >
            <item.icon size={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/[0.05] p-3 flex flex-col gap-3">
        {isCollapsed && (
          <button onClick={toggleCollapsed} className="text-slate-400 hover:text-white hidden lg:flex justify-center py-2 rounded-lg hover:bg-white/[0.03] w-full" aria-label="Expand sidebar">
            <ChevronRight size={18} />
          </button>
        )}
        {user && (
          <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : 'px-1')}>
            <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
              {user.name[0]?.toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-100 truncate">{user.name}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">{user.role}</span>
              </div>
            )}
          </div>
        )}
        <button onClick={logout} title={isCollapsed ? 'Sign out' : undefined} className={cn('flex items-center gap-3 py-2 px-3 text-sm font-semibold rounded-lg text-slate-400 hover:bg-rose-950/20 hover:text-rose-400', isCollapsed && 'justify-center')}>
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
