import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['admin', 'sales']).default('sales'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void
  loading?: boolean
}

export function RegisterForm({ onSubmit, loading = false }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales' },
  })

  const selectedRole = watch('role')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <Input
        {...register('name')}
        type="text"
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        leftIcon={<User size={16} />}
      />

      <Input
        {...register('email')}
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        error={errors.email?.message}
        leftIcon={<Mail size={16} />}
      />

      <Input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="••••••••"
        error={errors.password?.message}
        leftIcon={<Lock size={16} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <Dropdown
        label="Account Role"
        value={selectedRole}
        onChange={(val) => setValue('role', val as 'admin' | 'sales')}
        options={[
          { label: 'Sales Executive', value: 'sales' },
          { label: 'Administrator', value: 'admin' },
        ]}
        error={errors.role?.message}
      />

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        Create Account
      </Button>
    </form>
  )
}

export default RegisterForm
