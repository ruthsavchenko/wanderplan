import { useState } from 'react'
import { Pencil, Trash2, X, Check, ExternalLink, ArrowRight, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { FlightForm } from './FlightForm'
import { useUpdateFlight, useDeleteFlight } from '@/features/flights/flightsQueries'
import type { Flight, FlightFormValues } from '@/features/flights/flightsTypes'
import type { Traveler } from '@/features/travelers/travelersTypes'

interface FlightCardProps {
  flight: Flight
  tripId: string
  travelers: Traveler[]
}

function fmt(dt: string) {
  return format(new Date(dt), 'dd MMM yyyy, HH:mm')
}

export function FlightCard({ flight, tripId, travelers }: FlightCardProps) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updateFlight = useUpdateFlight()
  const deleteFlight = useDeleteFlight()

  const traveler = travelers.find((t) => t.id === flight.traveler_id)

  function handleUpdate(values: FlightFormValues) {
    updateFlight.mutate(
      {
        id: flight.id,
        tripId,
        flight: {
          ...values,
          traveler_id: values.traveler_id || null,
          booking_url: values.booking_url || null,
        },
      },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    deleteFlight.mutate({ id: flight.id, tripId })
  }

  if (editing) {
    const defaultValues: Partial<FlightFormValues> = {
      from_iata: flight.from_iata,
      to_iata: flight.to_iata,
      departure_at: format(new Date(flight.departure_at), "yyyy-MM-dd'T'HH:mm"),
      arrival_at: format(new Date(flight.arrival_at), "yyyy-MM-dd'T'HH:mm"),
      airline: flight.airline,
      flight_number: flight.flight_number,
      price: flight.price,
      currency: flight.currency,
      is_return: flight.is_return,
      traveler_id: flight.traveler_id ?? '',
      booking_url: flight.booking_url ?? '',
    }
    return (
      <div className="border border-amber/40 rounded-xl p-4 space-y-3">
        <FlightForm
          defaultValues={defaultValues}
          travelers={travelers}
          onSubmit={handleUpdate}
          isPending={updateFlight.isPending}
          submitLabel="Save"
        />
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      {/* Header row: route + badges + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-display text-xl text-navy font-semibold tracking-wide">
            {flight.from_iata}
          </span>
          <ArrowRight className="h-4 w-4 text-amber shrink-0" />
          <span className="font-display text-xl text-navy font-semibold tracking-wide">
            {flight.to_iata}
          </span>
          {flight.is_return && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber uppercase tracking-wide border border-amber/40 rounded-full px-2 py-0.5 shrink-0">
              <RotateCcw className="h-2.5 w-2.5" />
              Return
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {confirmDelete ? (
            <>
              <span className="text-xs text-muted mr-1">Delete?</span>
              <Button
                variant="coral"
                size="icon"
                className="h-7 w-7"
                onClick={handleDelete}
                disabled={deleteFlight.isPending}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setConfirmDelete(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 text-muted" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5 text-coral" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Times */}
      <p className="text-sm text-muted">
        {fmt(flight.departure_at)}
        <span className="mx-2 text-border">→</span>
        {fmt(flight.arrival_at)}
      </p>

      {/* Airline + price row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-navy">
          {flight.airline}
          <span className="text-muted mx-1.5">·</span>
          {flight.flight_number}
        </span>
        <span className="font-semibold text-navy text-sm">
          {flight.price.toLocaleString()} {flight.currency}
        </span>
      </div>

      {/* Traveler + booking URL */}
      {(traveler || flight.booking_url) && (
        <div className="flex items-center gap-3 flex-wrap">
          {traveler && (
            <span className="inline-flex items-center gap-1 text-xs bg-border/40 text-navy rounded-full px-2.5 py-0.5">
              {traveler.name}
            </span>
          )}
          {flight.booking_url && (
            <a
              href={flight.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber hover:underline"
            >
              View booking
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
