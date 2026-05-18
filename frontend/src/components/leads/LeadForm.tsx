import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'
import { LeadStatus, LeadSource } from '@leadflow/shared'

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource),
  notes: z.string().max(1000).optional(),
})

export type LeadFormValues = z.infer<typeof leadFormSchema>

export interface LeadFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<LeadFormValues>
  onSubmit: (data: LeadFormValues) => void
  loading?: boolean
}

export function LeadForm({ mode, initialData, onSubmit, loading = false }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      status: LeadStatus.New,
      source: LeadSource.Website,
      ...initialData,
    },
  })

  const status = watch('status')
  const source = watch('source')

  const statusOptions = Object.values(LeadStatus).map((s) => ({ label: s.toUpperCase(), value: s }))
  const sourceOptions = Object.values(LeadSource).map((s) => ({ label: s.toUpperCase(), value: s }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full" noValidate>
      <Input label="Name *" error={errors.name?.message} {...register('name')} />
      <Input label="Email Address *" type="email" error={errors.email?.message} {...register('email')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Dropdown label="Status" value={status} onChange={(val) => setValue('status', val as LeadStatus)} options={statusOptions} error={errors.status?.message} />
        <Dropdown label="Source" value={source} onChange={(val) => setValue('source', val as LeadSource)} options={sourceOptions} error={errors.source?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</label>
        <textarea
          rows={3}
          placeholder="Add comments or notes..."
          className="w-full bg-obsidian-600 border border-white/[0.05] rounded-lg text-slate-100 text-sm py-2.5 px-4 transition-all duration-200 outline-none placeholder-slate-500 focus:border-accent focus:ring-1 focus:ring-accent"
          {...register('notes')}
        />
        {errors.notes && <span className="text-xs font-medium text-rose-400">{errors.notes.message}</span>}
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
        {mode === 'edit' ? 'Save Changes' : 'Create Lead'}
      </Button>
    </form>
  )
}

export default LeadForm
