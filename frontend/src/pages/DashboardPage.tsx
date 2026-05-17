import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useLeadsStore } from '@/store/leadsStore'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  Plus,
  ArrowUpRight
} from 'lucide-react'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const leads = useLeadsStore((state) => state.leads)
  const isLoading = useLeadsStore((state) => state.isLoading)
  const fetchLeads = useLeadsStore((state) => state.fetchLeads)

  useEffect(() => {
    // Fetch a large limit on dashboard to accurately compute all KPI statistics
    fetchLeads({ limit: 1000, page: 1 })
  }, [fetchLeads])

  // Derive all KPIs
  const totalLeads = leads.length
  
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const newThisWeek = leads.filter((l) => new Date(l.createdAt) >= oneWeekAgo).length

  const qualifiedCount = leads.filter((l) => l.status === 'qualified').length
  const qualifiedRate = totalLeads ? Math.round((qualifiedCount / totalLeads) * 100) : 0

  const lostCount = leads.filter((l) => l.status === 'lost').length
  const lostRate = totalLeads ? Math.round((lostCount / totalLeads) * 100) : 0

  if (isLoading && totalLeads === 0) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome header banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase font-display">
            Welcome back, {user?.name?.split(' ')[0] ?? 'User'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Here is your sales pipeline overview for today.
          </p>
        </div>
        <Link to="/leads">
          <Button variant="primary" size="sm" icon={<Plus size={14} />}>
            Manage Pipeline
          </Button>
        </Link>
      </section>

      {totalLeads === 0 ? (
        <div className="bg-obsidian-700 border border-white/[0.05] p-12 rounded-xl flex items-center justify-center">
          <EmptyState
            icon={<Users size={20} />}
            title="Your Sales Pipeline is Empty"
            description="Welcome to LeadFlow! Register your first lead to begin tracking your conversion rates and analytics."
            action={{
              label: 'Register First Lead',
              onClick: () => { window.location.href = '/leads' },
              icon: <Plus size={14} />,
              variant: 'primary'
            }}
          />
        </div>
      ) : (
        <>
          {/* KPI grid panel */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/leads" className="obsidian-card p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Users size={22} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-accent transition-colors" />
              </div>
              <div className="mt-6">
                <span className="text-4xl font-bold font-mono tracking-tight text-white">{totalLeads}</span>
                <p className="text-xs text-slate-400 font-semibold mt-1">Total Leads</p>
              </div>
            </Link>

            <Link to="/leads" className="obsidian-card p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <TrendingUp size={22} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
              </div>
              <div className="mt-6">
                <span className="text-4xl font-bold font-mono tracking-tight text-white">{newThisWeek}</span>
                <p className="text-xs text-slate-400 font-semibold mt-1">New This Week</p>
              </div>
            </Link>

            <Link to="/leads?status=qualified" className="obsidian-card p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={22} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="mt-6">
                <span className="text-4xl font-bold font-mono tracking-tight text-white">{qualifiedRate}%</span>
                <p className="text-xs text-slate-400 font-semibold mt-1">Qualified Rate</p>
              </div>
            </Link>

            <Link to="/leads?status=lost" className="obsidian-card p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <XCircle size={22} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-rose-500 transition-colors" />
              </div>
              <div className="mt-6">
                <span className="text-4xl font-bold font-mono tracking-tight text-white">{lostRate}%</span>
                <p className="text-xs text-slate-400 font-semibold mt-1">Lost Rate</p>
              </div>
            </Link>
          </section>

          {/* Quick analysis charts segment */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="obsidian-card p-6 lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Performance Index</h3>
                <p className="text-xs text-slate-400 mt-1">Status distributions inside active stages</p>
              </div>
              <div className="h-40 flex items-end justify-around gap-2 mt-6">
                <div className="flex flex-col items-center gap-2 w-12">
                  <div className="w-full bg-accent/20 rounded-t-md hover:bg-accent/30 transition-all" style={{ height: `${totalLeads ? Math.max(10, Math.min(100, (leads.filter(l => l.status === 'new').length / totalLeads) * 100)) : 10}%` }} />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">New</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-12">
                  <div className="w-full bg-amber-500/20 rounded-t-md hover:bg-amber-500/30 transition-all" style={{ height: `${totalLeads ? Math.max(10, Math.min(100, (leads.filter(l => l.status === 'contacted').length / totalLeads) * 100)) : 10}%` }} />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Contact</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-12">
                  <div className="w-full bg-emerald-500/20 rounded-t-md hover:bg-emerald-500/30 transition-all" style={{ height: `${totalLeads ? Math.max(10, Math.min(100, qualifiedRate)) : 10}%` }} />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Qual</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-12">
                  <div className="w-full bg-rose-500/20 rounded-t-md hover:bg-rose-500/30 transition-all" style={{ height: `${totalLeads ? Math.max(10, Math.min(100, lostRate)) : 10}%` }} />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Lost</span>
                </div>
              </div>
            </div>
            
            <div className="obsidian-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Source Analysis</h3>
                <p className="text-xs text-slate-400 mt-1">Lead acquisition channels comparison</p>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
                    <span>Website</span>
                    <span>{leads.filter(l => l.source === 'website').length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${totalLeads ? (leads.filter(l => l.source === 'website').length / totalLeads) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
                    <span>Instagram</span>
                    <span>{leads.filter(l => l.source === 'instagram').length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: `${totalLeads ? (leads.filter(l => l.source === 'instagram').length / totalLeads) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
                    <span>Referral</span>
                    <span>{leads.filter(l => l.source === 'referral').length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalLeads ? (leads.filter(l => l.source === 'referral').length / totalLeads) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default DashboardPage
