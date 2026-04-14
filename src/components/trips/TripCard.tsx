import { Link } from 'react-router-dom'
import { MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { Trip } from '@/features/trips/tripsTypes'

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  const start = format(new Date(trip.start_date), 'MMM d')
  const end = format(new Date(trip.end_date), 'MMM d, yyyy')

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-36 bg-navy/10 relative overflow-hidden">
        {trip.cover_image_url ? (
          <img
            src={trip.cover_image_url}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-4 grid-rows-4 gap-px opacity-10 absolute inset-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border border-navy" />
              ))}
            </div>
            <MapPin className="h-10 w-10 text-navy/30" strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute top-3 right-3 bg-amber text-navy text-xs font-semibold px-2 py-0.5 rounded">
          {trip.currency}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-navy font-semibold truncate">{trip.title}</h3>
        <div className="flex items-center gap-1 text-muted text-sm mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{trip.destination}</span>
        </div>
        <div className="flex items-center gap-1 text-muted text-sm mt-1">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>
            {start} — {end}
          </span>
        </div>
      </div>
    </Link>
  )
}
