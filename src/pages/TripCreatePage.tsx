import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreateTrip } from '@/features/trips/tripsQueries'
import { PageHeader } from '@/components/common/PageHeader'
import { TripForm } from '@/components/trips/TripForm'
import type { TripFormValues } from '@/features/trips/tripsTypes'

export default function TripCreatePage() {
  const navigate = useNavigate()
  const { mutate, isPending, error } = useCreateTrip()

  function handleSubmit(values: TripFormValues) {
    mutate(values, {
      onSuccess: (trip) => navigate(`/trips/${trip.id}`),
    })
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to trips
      </Link>

      <PageHeader title="New Trip" subtitle="Fill in the details to start planning." />

      {error && (
        <p className="mb-4 text-sm text-coral">
          {(error as Error).message ?? 'Something went wrong.'}
        </p>
      )}

      <TripForm onSubmit={handleSubmit} isPending={isPending} submitLabel="Create Trip" />
    </div>
  )
}
