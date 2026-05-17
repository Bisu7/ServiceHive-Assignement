import React, { useState } from 'react'
import { Bell, Menu, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutStore } from '@/store/layoutStore'
import { ThemeToggle } from './ThemeToggle'

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth()
  const { toggleMobileOpen } = useLayoutStore()
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/[0.05] bg-obsidian-700 px-6 relative">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileOpen}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-white tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
        </button>

        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-9 items-center gap-2 px-3 rounded-lg border border-white/[0.05] hover:bg-white/[0.03] transition-colors text-slate-300 hover:text-white"
            >
              <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold flex items-center justify-center text-xs">
                {user.name[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-semibold hidden md:inline truncate max-w-[100px]">{user.name}</span>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-48 bg-obsidian-700 border border-white/[0.08] rounded-lg shadow-xl py-1 duration-200">
                  <div className="px-4 py-2 border-b border-white/[0.05] flex flex-col">
                    <span className="text-sm font-bold text-slate-200 truncate">{user.name}</span>
                    <span className="text-xs text-slate-500 truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Topbar
