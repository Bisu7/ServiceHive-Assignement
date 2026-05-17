import React from 'react'
import { Link } from 'react-router-dom'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useAuth } from '@/hooks/useAuth'

export function RegisterPage() {
  const { register, isLoading } = useAuth()

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-obsidian-800 text-slate-100 font-sans overflow-hidden">
      {/* Left panel: Branding & Decorative premium SVGs */}
      <section className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-obsidian-900 to-obsidian-950 border-r border-white/[0.05] relative overflow-hidden">
        {/* Glow vector shapes */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white font-bold text-lg shadow-lg shadow-accent/20">LF</div>
          <span className="font-bold uppercase tracking-wider text-white text-lg">LeadFlow</span>
        </div>

        <div className="relative z-10 my-auto flex flex-col gap-6">
          <h2 className="text-4xl font-semibold tracking-wide text-white leading-tight">
            Build your team's<br />
            ultimate sales pipeline.
          </h2>
          <p className="text-slate-400 max-w-sm">
            Empower your team to track, qualify, and close leads inside a beautiful and highly reactive collaborative dashboard workspace.
          </p>
          
          {/* Abstract SVG shapes representing a bar / stack graph */}
          <svg className="w-64 h-32 text-accent/20 mt-4" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="50" width="16" height="30" rx="3" fill="currentColor" opacity="0.4" />
            <rect x="50" y="30" width="16" height="50" rx="3" fill="currentColor" opacity="0.6" />
            <rect x="80" y="20" width="16" height="60" rx="3" fill="currentColor" opacity="0.8" />
            <rect x="110" y="10" width="16" height="70" rx="3" fill="currentColor" />
            <line x1="10" y1="80" x2="150" y2="80" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} LeadFlow CRM. All rights reserved.
        </div>
      </section>

      {/* Right panel: Centered register form */}
      <section className="flex items-center justify-center p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 flex flex-col items-center md:items-start gap-2">
            <div className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white font-bold text-lg shadow-lg mb-2">LF</div>
            <h1 className="text-2xl font-bold tracking-wide text-white uppercase">Register</h1>
            <p className="text-sm text-slate-400">Join the LeadFlow sales platform workspace.</p>
          </div>

          <div className="bg-obsidian-700 border border-white/[0.05] p-8 rounded-xl duration-200">
            <RegisterForm onSubmit={(data) => register(data as any)} loading={isLoading} />

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-400">Already registered? </span>
              <Link to="/login" className="font-semibold text-accent hover:text-accent-focus transition-colors">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
