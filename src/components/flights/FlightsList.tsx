import { useState } from 'react'
import { PlaneTakeoff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { FlightCard } from './FlightCard'
import { FlightForm } from './FlightForm'
import { useFlights, useCreateFlight } from '@/features/flights/flightsQueries'
import { useTravelers } from '@/features/travelers/travelersQueries'
import type { FlightFormValues } from '@/features/flights/flightsTypes'

interface FlightsListProps {
  tripId: string
  defaultCurrency?: string
}

export function FlightsList({ tripId, defaultCurrency }: FlightsListProps) {
  const [adding, setAdding] = useState(false)

  const { data: flights = [], isLoading } = useFlights(tripId)
  const { data: travelers = [] } = useTravelers(tripId)
  const createFlight = useCreateFlight()

  function handleAdd(values: FlightFormValues) {
    createFlight.mutate(
      {
        tripId,
        flight: {
          ...values,
          traveler_id: values.traveler_id || null,
          booking_url: values.booking_url || null,
        },
      },
      { onSuccess: () => setAdding(false) }
    )
  }

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg text-navy">Flights</h2>
          {flights.length > 0 && (
            <span className="text-xs font-semibold text-muted bg-border/60 rounded-full px-2 py-0.5">
              {flights.length}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setAdding((v) => !v)}>
          <PlaneTakeoff className="h-3.5 w-3.5 mr-1.5" />
          Add Flight
        </Button>
      </div>

      {adding && (
        <div className="px-5 py-4 border-b border-border bg-bg">
          <FlightForm
            travelers={travelers}
            defaultCurrency={defaultCurrency}
            onSubmit={handleAdd}
            isPending={createFlight.isPending}
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
            <div key={i} className="h-24 rounded-xl bg-border/40 animate-pulse" />
          ))}
        </div>
      ) : flights.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={PlaneTakeoff}
            title="No flights yet"
            description="Add flights to track your travel itinerary and costs."
          />
        </div>
      ) : (
        <div className="p-5 space-y-3">
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              tripId={tripId}
              travelers={travelers}
            />
          ))}
        </div>
      )}
    </section>
  )
}
