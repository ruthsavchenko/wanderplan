import { useState } from 'react'
import { Pencil, Trash2, X, Check, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TravelerForm } from './TravelerForm'
import { useUpdateTraveler, useDeleteTraveler } from '@/features/travelers/travelersQueries'
import type { Traveler, TravelerFormValues } from '@/features/travelers/travelersTypes'

interface TravelerCardProps {
  traveler: Traveler
  tripId: string
}

export function TravelerCard({ traveler, tripId }: TravelerCardProps) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updateTraveler = useUpdateTraveler()
  const deleteTraveler = useDeleteTraveler()

  const initials = traveler.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleUpdate(values: TravelerFormValues) {
    updateTraveler.mutate(
      {
        id: traveler.id,
        tripId,
        traveler: { name: values.name, email: values.email || null },
      },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    deleteTraveler.mutate({ id: traveler.id, tripId })
  }

  if (editing) {
    return (
      <div className="border border-amber/40 rounded-xl p-4 space-y-3">
        <TravelerForm
          defaultValues={{ name: traveler.name, email: traveler.email ?? '' }}
          onSubmit={handleUpdate}
          isPending={updateTraveler.isPending}
          submitLabel="Save"
        />
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 border border-border rounded-xl p-4">
      <div className="h-9 w-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold shrink-0">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-navy">{traveler.name}</span>
          {traveler.is_owner && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber uppercase tracking-wide">
              <Crown className="h-3 w-3" />
              Owner
            </span>
          )}
        </div>
        {traveler.email && (
          <p className="text-xs text-muted truncate">{traveler.email}</p>
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
              disabled={deleteTraveler.isPending}
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
            {!traveler.is_owner && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5 text-coral" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
