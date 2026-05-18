import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useLayoutStore } from '@/store/layoutStore'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/leads': 'Leads Pipeline',
}

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? PAGE_TITLES[`/${pathname.split('/')[1]}`] ?? 'GigFlow – Smart Leads Dashboard'
}

export function DashboardLayout() {
  const { pathname } = useLocation()
  const { isMobileOpen, setMobileOpen } = useLayoutStore()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-obsidian-800 text-slate-100 font-sans">
      <Sidebar />

      {/* Mobile Drawer backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Topbar title={getPageTitle(pathname)} />
        <main className="flex-1 overflow-y-auto p-6" id="main-content" role="main">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
