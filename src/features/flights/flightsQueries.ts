import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { flightsService } from './flightsService'
import type { FlightCreate } from './flightsTypes'

export const flightKeys = {
  byTrip: (tripId: string) => ['flights', tripId] as const,
}

export function useFlights(tripId: string) {
  return useQuery({
    queryKey: flightKeys.byTrip(tripId),
    queryFn: () => flightsService.getByTrip(tripId),
    enabled: !!tripId,
  })
}

export function useCreateFlight() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, flight }: { tripId: string; flight: FlightCreate }) =>
      flightsService.create(tripId, flight),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: flightKeys.byTrip(tripId) }),
  })
}

export function useUpdateFlight() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      flight,
    }: {
      id: string
      tripId: string
      flight: Partial<FlightCreate>
    }) => flightsService.update(id, flight),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: flightKeys.byTrip(tripId) }),
  })
}

export function useDeleteFlight() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; tripId: string }) => flightsService.delete(id),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: flightKeys.byTrip(tripId) }),
  })
}
