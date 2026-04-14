import { useState } from 'react'
import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { TravelerCard } from './TravelerCard'
import { TravelerForm } from './TravelerForm'
import { useTravelers, useCreateTraveler } from '@/features/travelers/travelersQueries'
import type { TravelerFormValues } from '@/features/travelers/travelersTypes'

interface TravelersListProps {
  tripId: string
}

export function TravelersList({ tripId }: TravelersListProps) {
  const [adding, setAdding] = useState(false)

  const { data: travelers = [], isLoading } = useTravelers(tripId)
  const createTraveler = useCreateTraveler()

  function handleAdd(values: TravelerFormValues) {
    createTraveler.mutate(
      {
        tripId,
        traveler: { name: values.name, email: values.email || null },
      },
      { onSuccess: () => setAdding(false) }
    )
  }

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg text-navy">Travelers</h2>
          {travelers.length > 0 && (
            <span className="text-xs font-semibold text-muted bg-border/60 rounded-full px-2 py-0.5">
              {travelers.length}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAdding((v) => !v)}
        >
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Add Traveler
        </Button>
      </div>

      {adding && (
        <div className="px-5 py-4 border-b border-border bg-bg">
          <TravelerForm
            onSubmit={handleAdd}
            isPending={createTraveler.isPending}
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
            <div key={i} className="h-14 rounded-xl bg-border/40 animate-pulse" />
          ))}
        </div>
      ) : travelers.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={Users}
            title="No travelers yet"
            description="Add the people joining this trip."
          />
        </div>
      ) : (
        <div className="p-5 space-y-3">
          {travelers.map((traveler) => (
            <TravelerCard key={traveler.id} traveler={traveler} tripId={tripId} />
          ))}
        </div>
      )}
    </section>
  )
}
