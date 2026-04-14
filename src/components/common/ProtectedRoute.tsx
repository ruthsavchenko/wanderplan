import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'

export function ProtectedRoute() {
  const { session, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-navy border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}
