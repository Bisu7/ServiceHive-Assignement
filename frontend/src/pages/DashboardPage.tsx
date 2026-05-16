import { useAuthStore } from '@/store/authStore'
import { useLeadsStore } from '@/store/leadsStore'
import { LeadStatus } from '@leadflow/shared'
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/types/lead.types'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, Users, CheckCircle2, XCircle } from 'lucide-react'

/** Summary card for KPI metrics on the dashboard */
function StatCard({ label, value, icon: Icon, colorClass }: { label: string; value: number; icon: React.ElementType; colorClass: string }) {
  return (
    <div className="glass-card flex items-center gap-4 p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  )
}

/**
 * Dashboard page showing aggregate lead stats.
 * Data is derived from the leads already in the Zustand store.
 */
export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const leads = useLeadsStore((state) => state.leads)

  const won = leads.filter((l) => l.status === LeadStatus.Won).length
  const lost = leads.filter((l) => l.status === LeadStatus.Lost).length
  const active = leads.filter((l) => l.status !== LeadStatus.Won && l.status !== LeadStatus.Lost).length

  const statusBreakdown = Object.values(LeadStatus).map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }))

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Greeting */}
      <section>
        <h2 className="text-2xl font-bold text-white">
          Good morning, <span className="gradient-text">{user?.name?.split(' ')[0] ?? 'there'}</span> 👋
        </h2>
        <p className="mt-1 text-slate-400">Here&apos;s a snapshot of your pipeline.</p>
      </section>

      {/* KPI cards */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Leads" value={leads.length} icon={Users} colorClass="bg-brand-500/20 text-brand-400" />
          <StatCard label="Active" value={active} icon={TrendingUp} colorClass="bg-blue-500/20 text-blue-400" />
          <StatCard label="Won" value={won} icon={CheckCircle2} colorClass="bg-emerald-500/20 text-emerald-400" />
          <StatCard label="Lost" value={lost} icon={XCircle} colorClass="bg-red-500/20 text-red-400" />
        </div>
      </section>

      {/* Status breakdown */}
      <section aria-label="Lead status breakdown" className="glass-card p-5">
        <h3 className="mb-4 font-semibold text-slate-200">Status Breakdown</h3>
        <div className="flex flex-col gap-2">
          {statusBreakdown.map(({ status, count }) => (
            <div key={status} className="flex items-center justify-between">
              <Badge colorClass={LEAD_STATUS_COLORS[status]}>{LEAD_STATUS_LABELS[status]}</Badge>
              <span className="text-sm font-medium text-slate-300">{count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
