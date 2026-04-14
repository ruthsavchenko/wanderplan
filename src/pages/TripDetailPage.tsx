import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Pencil, Trash2, X, Check } from 'lucide-react'
import { format } from 'date-fns'
import { useTrip, useUpdateTrip, useDeleteTrip } from '@/features/trips/tripsQueries'
import { PageHeader } from '@/components/common/PageHeader'
import { TripForm } from '@/components/trips/TripForm'
import { TravelersList } from '@/components/travelers/TravelersList'
import { FlightsList } from '@/components/flights/FlightsList'
import { AccommodationList } from '@/components/accommodation/AccommodationList'
import { BudgetDashboard } from '@/components/budget/BudgetDashboard'
import { Button } from '@/components/ui/button'
import type { TripFormValues } from '@/features/trips/tripsTypes'

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: trip, isLoading, isError } = useTrip(id!)
  const updateTrip = useUpdateTrip()
  const deleteTrip = useDeleteTrip()

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        <div className="h-8 w-48 bg-border/40 rounded animate-pulse" />
        <div className="h-48 bg-border/40 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-coral">Trip not found.</p>
        <Link to="/" className="text-sm text-amber underline mt-2 inline-block">
          Back to trips
        </Link>
      </div>
    )
  }

  function handleUpdate(values: TripFormValues) {
    updateTrip.mutate(
      { id: trip!.id, trip: values },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    deleteTrip.mutate(trip!.id, {
      onSuccess: () => navigate('/'),
    })
  }

  const nights = Math.round(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        My Trips
      </Link>

      <PageHeader title={trip.title} subtitle={trip.destination}>
        {!editing && (
          <>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Delete?</span>
                <Button
                  variant="coral"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteTrip.isPending}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-3.5 w-3.5 text-coral" />
              </Button>
            )}
          </>
        )}
      </PageHeader>

      {editing ? (
        <div>
          <TripForm
            defaultValues={{
              title: trip.title,
              destination: trip.destination,
              start_date: trip.start_date,
              end_date: trip.end_date,
              currency: trip.currency,
              cover_image_url: trip.cover_image_url ?? '',
            }}
            onSubmit={handleUpdate}
            isPending={updateTrip.isPending}
            submitLabel="Save Changes"
          />
          <Button
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCard label="Destination">
              <MapPin className="h-4 w-4 text-amber shrink-0" />
              {trip.destination}
            </InfoCard>
            <InfoCard label="Departure">
              <Calendar className="h-4 w-4 text-amber shrink-0" />
              {format(new Date(trip.start_date), 'MMM d, yyyy')}
            </InfoCard>
            <InfoCard label="Return">
              <Calendar className="h-4 w-4 text-amber shrink-0" />
              {format(new Date(trip.end_date), 'MMM d, yyyy')}
            </InfoCard>
            <InfoCard label="Duration">
              <span className="text-navy font-semibold">{nights}</span>
              <span className="text-muted text-xs ml-1">nights</span>
            </InfoCard>
          </div>

          <div className="border border-border rounded-xl p-5 space-y-3">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Currency</p>
            <p className="font-display text-2xl text-navy">{trip.currency}</p>
          </div>

          <TravelersList tripId={trip.id} />

          <FlightsList tripId={trip.id} defaultCurrency={trip.currency} />

          <AccommodationList tripId={trip.id} defaultCurrency={trip.currency} />

          <BudgetDashboard tripId={trip.id} defaultCurrency={trip.currency} />

          <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted text-sm">
            Itinerary coming soon.
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-1">
      <p className="text-xs text-muted uppercase tracking-wider font-semibold">{label}</p>
      <div className="flex items-center gap-1.5 text-sm text-navy">{children}</div>
    </div>
  )
}
