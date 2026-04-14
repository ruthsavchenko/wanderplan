import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/authStore'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import AuthPage from '@/pages/AuthPage'
import DashboardPage from '@/pages/DashboardPage'
import TripDetailPage from '@/pages/TripDetailPage'
import TripCreatePage from '@/pages/TripCreatePage'

const queryClient = new QueryClient()

function AuthInitializer() {
  const initialize = useAuthStore((s) => s.initialize)
  useEffect(() => initialize(), [initialize])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer />
        <div className="min-h-screen bg-bg">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/trips/new" element={<TripCreatePage />} />
              <Route path="/trips/:id" element={<TripDetailPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
