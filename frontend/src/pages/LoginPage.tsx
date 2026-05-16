import { LoginForm } from '@/components/auth/LoginForm'
import { Zap } from 'lucide-react'

/** Public login page with centered card layout */
export function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-surface-950 px-4 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 shadow-xl shadow-brand-500/20">
            <Zap className="h-8 w-8 text-white fill-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">LeadFlow</h1>
            <p className="mt-2 text-slate-400">Manage your sales pipeline with precision</p>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-card p-8 animate-slide-up">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}

