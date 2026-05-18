import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void
  loading?: boolean
}

export function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <Input
        {...register('email')}
        type="email"
        label="Email Address"
        error={errors.email?.message}
        leftIcon={<Mail size={16} />}
      />

      <Input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        label="Password"
        error={errors.password?.message}
        leftIcon={<Lock size={16} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        Sign In
      </Button>
    </form>
  )
}

export default LoginForm
