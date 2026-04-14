import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardPage from '@/pages/DashboardPage'
import TripDetailPage from '@/pages/TripDetailPage'
import TripCreatePage from '@/pages/TripCreatePage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-bg">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/trips/new" element={<TripCreatePage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
