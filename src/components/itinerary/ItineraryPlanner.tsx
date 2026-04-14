import { useMemo } from 'react'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { DayCard } from './DayCard'
import { useDaysWithItems } from '@/features/itinerary/itineraryQueries'

interface ItineraryPlannerProps {
  tripId: string
  startDate: string
  endDate: string
}

export function ItineraryPlanner({ tripId, startDate, endDate }: ItineraryPlannerProps) {
  const { data: days = [], isLoading } = useDaysWithItems(tripId)

  const allDates = useMemo(
    () =>
      eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate),
      }),
    [startDate, endDate]
  )

  const dayMap = useMemo(
    () => new Map(days.map((d) => [d.date, d])),
    [days]
  )

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-amber" />
          <h2 className="font-display text-lg text-navy">Itinerary</h2>
          <span className="text-xs font-semibold text-muted bg-border/60 rounded-full px-2 py-0.5">
            {allDates.length} day{allDates.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="p-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-border/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {allDates.map((date, i) => {
            const dateStr = format(date, 'yyyy-MM-dd')
            return (
              <DayCard
                key={dateStr}
                dayNumber={i + 1}
                date={dateStr}
                day={dayMap.get(dateStr)}
                tripId={tripId}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
