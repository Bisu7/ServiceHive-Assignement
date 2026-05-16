import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { LeadStatus, LeadSource } from '@leadflow/shared'
import { LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS } from '@/types/lead.types'
import type { ILead } from '@leadflow/shared'

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource),
  value: z.coerce.number().nonnegative().optional(),
  notes: z.string().max(2000).optional(),
})

type LeadFormValues = z.infer<typeof leadFormSchema>

interface LeadFormProps {
  /** Pre-populated values when editing an existing lead */
  defaultValues?: Partial<ILead>
  onSubmit: (data: LeadFormValues) => Promise<void>
  isLoading: boolean
  submitLabel?: string
}

const statusOptions = Object.values(LeadStatus).map((v) => ({ value: v, label: LEAD_STATUS_LABELS[v] }))
const sourceOptions = Object.values(LeadSource).map((v) => ({ value: v, label: LEAD_SOURCE_LABELS[v] }))

/** Reusable lead create/edit form wired to RHF + Zod */
export function LeadForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Save lead' }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      status: LeadStatus.New,
      source: LeadSource.Other,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id="lf-name" label="Full name *" placeholder="Jane Smith" error={errors.name?.message} {...register('name')} />
        <Input id="lf-email" label="Email *" type="email" placeholder="jane@acme.com" error={errors.email?.message} {...register('email')} />
        <Input id="lf-phone" label="Phone" type="tel" placeholder="+1 555 000 0000" error={errors.phone?.message} {...register('phone')} />
        <Input id="lf-company" label="Company" placeholder="Acme Corp" error={errors.company?.message} {...register('company')} />
        <Input id="lf-value" label="Deal value (USD)" type="number" placeholder="0" error={errors.value?.message} {...register('value')} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Dropdown id="lf-status" label="Status" options={statusOptions} value={field.value} onChange={field.onChange} />
          )}
        />
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Dropdown id="lf-source" label="Source" options={sourceOptions} value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lf-notes" className="text-sm font-medium text-slate-300">Notes</label>
        <textarea
          id="lf-notes"
          rows={3}
          placeholder="Add context about this lead…"
          className="w-full resize-none rounded-lg border border-white/10 bg-surface-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...register('notes')}
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="mt-2">
        {submitLabel}
      </Button>
    </form>
  )
}
