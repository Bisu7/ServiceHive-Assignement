import { useAuthStore } from '@/store/authStore'
import { useLeadsStore } from '@/store/leadsStore'
import { LeadStatus } from '@leadflow/shared'
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

/** Summary card for KPI metrics with trend indicators */
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  colorClass,
  trend
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType; 
  colorClass: string;
  trend?: { value: string; positive: boolean }
}) {
  return (
    <div className="clean-card p-6">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClass} shadow-sm`}>
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-bold ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="mt-5">
        <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-500">{label}</p>
      </div>
    </div>
  )
}

/**
 * Dashboard page showing aggregate lead stats.
 * Uses a bright, high-contrast layout for a professional "Real" feel.
 */
export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const leads = useLeadsStore((state) => state.leads)

  const qualified = leads.filter((l) => l.status === LeadStatus.Qualified).length
  const lost = leads.filter((l) => l.status === LeadStatus.Lost).length
  const active = leads.filter((l) => l.status !== LeadStatus.Qualified && l.status !== LeadStatus.Lost).length

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* Greeting Section */}
      <section>
        <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Hello, {user?.name?.split(' ')[0] ?? 'User'}
        </h2>
        <p className="mt-2 text-lg font-medium text-slate-500 dark:text-zinc-400">
          Your pipeline is looking healthy. You have <span className="text-brand-600 font-bold">{active} active</span> leads to follow up on.
        </p>
      </section>

      {/* KPI Stats Grid */}
      <section aria-label="Key performance indicators">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Total Leads" 
            value={leads.length} 
            icon={Users} 
            colorClass="bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
            trend={{ value: '12%', positive: true }}
          />
          <StatCard 
            label="Active Pipeline" 
            value={active} 
            icon={TrendingUp} 
            colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            trend={{ value: '5%', positive: true }}
          />
          <StatCard 
            label="Leads Qualified" 
            value={qualified} 
            icon={CheckCircle2} 
            colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
            trend={{ value: '8%', positive: true }}
          />
          <StatCard 
            label="Deals Lost" 
            value={lost} 
            icon={XCircle} 
            colorClass="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
            trend={{ value: '2%', positive: false }}
          />
        </div>
      </section>

      {/* Placeholder for charts/recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="clean-card flex aspect-video items-center justify-center lg:col-span-2">
          <p className="text-sm font-medium text-slate-400">Pipeline Performance Chart</p>
        </div>
        <div className="clean-card flex items-center justify-center">
          <p className="text-sm font-medium text-slate-400">Recent Activity Feed</p>
        </div>
      </div>
    </div>
  )
}
