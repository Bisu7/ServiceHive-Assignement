import { RegisterForm } from '@/components/auth/RegisterForm'
import { Zap } from 'lucide-react'

/** Public registration page with centered card layout */
export function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-950 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 shadow-lg shadow-brand-500/30">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-slate-400">Start managing your leads with LeadFlow</p>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-card p-8 animate-slide-up">
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
