import React from 'react'
import { Button, ButtonProps } from './Button'

export interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: ButtonProps['variant']
    icon?: React.ReactNode
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-obsidian-700/30 border border-white/[0.03] rounded-xl max-w-md mx-auto">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-obsidian-600 border border-white/[0.05] text-accent mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
      {action && (
        <Button variant={action.variant || 'primary'} onClick={action.onClick} icon={action.icon} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
