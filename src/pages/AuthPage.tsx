import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { AuthForm } from '@/components/auth/AuthForm'
import { useAuthStore } from '@/features/auth/authStore'

export default function AuthPage() {
  const { session, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const needsConfirmation = searchParams.get('confirm') === '1'

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/', { replace: true })
    }
  }, [session, isLoading, navigate])

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative grid lines (cartographic) */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="h-6 w-6 text-amber" />
            <span className="font-display text-xl font-bold">WanderPlan</span>
          </div>
        </div>

        <div className="relative">
          <blockquote className="font-display text-3xl font-bold text-white leading-snug">
            "Not all those who wander are lost."
          </blockquote>
          <p className="mt-3 text-white/50 text-sm">Plan every journey. Remember every moment.</p>
        </div>

        <div className="relative flex gap-2">
          {['#E8963A', '#E85D4A', '#FAF9F6'].map((color) => (
            <div key={color} className="h-1.5 w-8 rounded-full" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <MapPin className="h-5 w-5 text-amber" />
          <span className="font-display text-lg font-bold text-navy">WanderPlan</span>
        </div>

        {needsConfirmation ? (
          <div className="w-full max-w-md text-center">
            <h1 className="font-display text-3xl font-bold text-navy mb-3">Check your email</h1>
            <p className="text-muted text-sm mb-6">
              We sent a confirmation link to your inbox. Click it to activate your account, then
              sign in below.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="text-sm font-medium text-amber hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  )
}
