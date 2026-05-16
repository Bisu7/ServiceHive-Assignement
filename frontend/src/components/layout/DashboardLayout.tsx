import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

/** Maps pathname prefixes to human-readable page titles for the topbar */
const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/leads': 'Leads',
}

function getPageTitle(pathname: string): string {
  // Exact match first, then prefix match for detail pages
  return PAGE_TITLES[pathname] ?? PAGE_TITLES[`/${pathname.split('/')[1]}`] ?? 'LeadFlow'
}

/** Root layout for authenticated pages — sidebar + topbar + scrollable content area */
export function DashboardLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={getPageTitle(pathname)} />
        <main className="flex-1 overflow-y-auto p-6" id="main-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
