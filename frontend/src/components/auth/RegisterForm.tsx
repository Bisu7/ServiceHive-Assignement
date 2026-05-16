import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

/** Registration form with password confirmation and strength validation */
export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = ({ name, email, password }: RegisterFormValues): void => {
    void registerUser({ name, email, password })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input id="reg-name" label="Full name" placeholder="Jane Smith" error={errors.name?.message} {...register('name')} />
      <Input id="reg-email" label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <Input id="reg-password" label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" error={errors.password?.message} {...register('password')} />
      <Input id="reg-confirm" label="Confirm password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Create account
      </Button>
      <p className="text-center text-sm text-slate-500 dark:text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </form>
  )
}
