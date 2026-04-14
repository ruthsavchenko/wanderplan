import { Link } from 'react-router-dom'
import { Plus, Map } from 'lucide-react'
import { useTrips } from '@/features/trips/tripsQueries'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { TripCard } from '@/components/trips/TripCard'

export default function DashboardPage() {
  const { data: trips, isLoading, isError } = useTrips()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader title="My Trips" subtitle="All your travel plans in one place.">
        <Button variant="amber" asChild>
          <Link to="/trips/new">
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Link>
        </Button>
      </PageHeader>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-xl bg-border/40 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-coral text-sm">Failed to load trips. Please try again.</p>
      )}

      {!isLoading && !isError && trips?.length === 0 && (
        <EmptyState
          icon={Map}
          title="No trips yet"
          description="Start planning your next adventure."
        >
          <Button variant="amber" asChild>
            <Link to="/trips/new">
              <Plus className="h-4 w-4 mr-2" />
              Create your first trip
            </Link>
          </Button>
        </EmptyState>
      )}

      {!isLoading && trips && trips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}
