import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Frown } from 'lucide-react'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-obsidian-800 px-4 text-center">
      <Frown className="h-16 w-16 text-slate-500 animate-pulse" aria-hidden />
      <div>
        <h1 className="text-5xl font-extrabold text-white">404</h1>
        <p className="mt-3 text-lg font-semibold text-slate-300">Page not found</p>
        <p className="mt-1 text-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link to="/">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </main>
  )
}

export default NotFoundPage
