import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { loginSchema, signupSchema } from '@/features/auth/authTypes'
import type { LoginFormData, SignupFormData, AuthMode } from '@/features/auth/authTypes'
import { useSignIn, useSignUp } from '@/features/auth/authQueries'

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login')
  const navigate = useNavigate()

  const signInMutation = useSignIn()
  const signUpMutation = useSignUp()

  const isLogin = mode === 'login'
  const schema = isLogin ? loginSchema : signupSchema
  const isPending = signInMutation.isPending || signUpMutation.isPending
  const error = signInMutation.error ?? signUpMutation.error

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema) as unknown as Resolver<SignupFormData>,
  })

  const toggleMode = () => {
    setMode(isLogin ? 'signup' : 'login')
    reset()
    signInMutation.reset()
    signUpMutation.reset()
  }

  const onSubmit = handleSubmit((data) => {
    if (isLogin) {
      signInMutation.mutate(data as unknown as LoginFormData, {
        onSuccess: () => navigate('/'),
      })
    } else {
      signUpMutation.mutate(data, {
        onSuccess: ({ user }) => {
          // Supabase may require email confirmation — show a message or redirect
          if (user?.confirmed_at || user?.email_confirmed_at) {
            navigate('/')
          } else {
            // email confirmation pending — sign-in page will handle it
            navigate('/auth?confirm=1')
          }
        },
      })
    }
  })

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-navy mb-2">
          {isLogin ? 'Welcome back' : 'Start planning'}
        </h1>
        <p className="text-muted text-sm">
          {isLogin
            ? 'Sign in to your WanderPlan account'
            : 'Create your account and plan your next adventure'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
            Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-coral">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-navy mb-1">
            Password
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-coral">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password (signup only) */}
        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy mb-1">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-coral">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {/* Server error */}
        {error && (
          <p className="text-xs text-coral bg-coral/10 rounded-md px-3 py-2">
            {error.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLogin ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {/* Mode toggle */}
      <p className="mt-6 text-center text-sm text-muted">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={toggleMode}
          className="font-medium text-amber hover:underline"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}
