import { useState } from 'react'
import { BedDouble } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { AccommodationCard } from './AccommodationCard'
import { AccommodationForm } from './AccommodationForm'
import {
  useAccommodations,
  useCreateAccommodation,
} from '@/features/accommodation/accommodationQueries'
import type { AccommodationFormValues } from '@/features/accommodation/accommodationTypes'

interface AccommodationListProps {
  tripId: string
  defaultCurrency?: string
}

export function AccommodationList({ tripId, defaultCurrency }: AccommodationListProps) {
  const [adding, setAdding] = useState(false)

  const { data: accommodations = [], isLoading } = useAccommodations(tripId)
  const createAccommodation = useCreateAccommodation()

  function handleAdd(values: AccommodationFormValues) {
    createAccommodation.mutate(
      {
        tripId,
        accommodation: {
          ...values,
          booking_url: values.booking_url || null,
          confirmation_code: values.confirmation_code || null,
        },
      },
      { onSuccess: () => setAdding(false) }
    )
  }

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg text-navy">Accommodation</h2>
          {accommodations.length > 0 && (
            <span className="text-xs font-semibold text-muted bg-border/60 rounded-full px-2 py-0.5">
              {accommodations.length}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setAdding((v) => !v)}>
          <BedDouble className="h-3.5 w-3.5 mr-1.5" />
          Add Accommodation
        </Button>
      </div>

      {adding && (
        <div className="px-5 py-4 border-b border-border bg-bg">
          <AccommodationForm
            defaultCurrency={defaultCurrency}
            onSubmit={handleAdd}
            isPending={createAccommodation.isPending}
          />
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setAdding(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="p-5 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-border/40 animate-pulse" />
          ))}
        </div>
      ) : accommodations.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={BedDouble}
            title="No accommodation yet"
            description="Add hotels, hostels or rentals to keep track of where you're staying."
          />
        </div>
      ) : (
        <div className="p-5 space-y-3">
          {accommodations.map((accommodation) => (
            <AccommodationCard
              key={accommodation.id}
              accommodation={accommodation}
              tripId={tripId}
            />
          ))}
        </div>
      )}
    </section>
  )
}
