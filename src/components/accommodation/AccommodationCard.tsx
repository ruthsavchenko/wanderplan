import { useState } from 'react'
import { Pencil, Trash2, X, Check, MapPin, Calendar, ExternalLink, Hash } from 'lucide-react'
import { format, differenceInCalendarDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { AccommodationForm } from './AccommodationForm'
import {
  useUpdateAccommodation,
  useDeleteAccommodation,
} from '@/features/accommodation/accommodationQueries'
import type {
  Accommodation,
  AccommodationFormValues,
} from '@/features/accommodation/accommodationTypes'

interface AccommodationCardProps {
  accommodation: Accommodation
  tripId: string
}

export function AccommodationCard({ accommodation, tripId }: AccommodationCardProps) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updateAccommodation = useUpdateAccommodation()
  const deleteAccommodation = useDeleteAccommodation()

  const nights = differenceInCalendarDays(
    new Date(accommodation.check_out),
    new Date(accommodation.check_in)
  )
  const total = accommodation.price_per_night * Math.max(nights, 0)

  function handleUpdate(values: AccommodationFormValues) {
    updateAccommodation.mutate(
      {
        id: accommodation.id,
        tripId,
        accommodation: {
          ...values,
          booking_url: values.booking_url || null,
          confirmation_code: values.confirmation_code || null,
        },
      },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    deleteAccommodation.mutate({ id: accommodation.id, tripId })
  }

  if (editing) {
    return (
      <div className="border border-amber/40 rounded-xl p-4 space-y-3">
        <AccommodationForm
          defaultValues={{
            name: accommodation.name,
            address: accommodation.address,
            check_in: accommodation.check_in,
            check_out: accommodation.check_out,
            price_per_night: accommodation.price_per_night,
            currency: accommodation.currency,
            booking_url: accommodation.booking_url ?? '',
            confirmation_code: accommodation.confirmation_code ?? '',
          }}
          onSubmit={handleUpdate}
          isPending={updateAccommodation.isPending}
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
      {/* Header: name + actions */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-navy leading-tight">{accommodation.name}</h3>

        <div className="flex items-center gap-1 shrink-0">
          {confirmDelete ? (
            <>
              <span className="text-xs text-muted mr-1">Delete?</span>
              <Button
                variant="coral"
                size="icon"
                className="h-7 w-7"
                onClick={handleDelete}
                disabled={deleteAccommodation.isPending}
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

      {/* Address */}
      <div className="flex items-start gap-1.5 text-sm text-muted">
        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber" />
        {accommodation.address}
      </div>

      {/* Dates + nights */}
      <div className="flex items-center gap-1.5 text-sm text-navy">
        <Calendar className="h-3.5 w-3.5 text-amber shrink-0" />
        {format(new Date(accommodation.check_in), 'dd MMM yyyy')}
        <span className="text-muted mx-1">→</span>
        {format(new Date(accommodation.check_out), 'dd MMM yyyy')}
        {nights > 0 && (
          <span className="text-xs text-muted ml-1">({nights} night{nights !== 1 ? 's' : ''})</span>
        )}
      </div>

      {/* Price row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm text-muted">
          {accommodation.price_per_night.toLocaleString()} {accommodation.currency}
          <span className="text-muted/60 ml-1">/ night</span>
        </span>
        {nights > 0 && (
          <span className="font-semibold text-navy text-sm">
            Total: {total.toLocaleString()} {accommodation.currency}
          </span>
        )}
      </div>

      {/* Confirmation code + booking URL */}
      {(accommodation.confirmation_code || accommodation.booking_url) && (
        <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-border">
          {accommodation.confirmation_code && (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Hash className="h-3 w-3" />
              {accommodation.confirmation_code}
            </span>
          )}
          {accommodation.booking_url && (
            <a
              href={accommodation.booking_url}
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
