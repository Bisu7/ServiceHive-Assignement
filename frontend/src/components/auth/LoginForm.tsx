import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

/** Login form with RHF + Zod validation and loading state */
export function LoginForm() {
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues): void => {
    void login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        id="login-email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="login-password"
        label="Password"
        type="password"
        placeholder="Your password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Sign in
      </Button>
      <p className="text-center text-sm text-slate-500 dark:text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Create one
        </Link>
      </p>
    </form>
  )
}
