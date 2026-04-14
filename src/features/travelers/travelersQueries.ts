import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { travelersService } from './travelersService'
import type { TravelerCreate } from './travelersTypes'

export const travelerKeys = {
  byTrip: (tripId: string) => ['travelers', tripId] as const,
}

export function useTravelers(tripId: string) {
  return useQuery({
    queryKey: travelerKeys.byTrip(tripId),
    queryFn: () => travelersService.getByTrip(tripId),
    enabled: !!tripId,
  })
}

export function useCreateTraveler() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, traveler }: { tripId: string; traveler: TravelerCreate }) =>
      travelersService.create(tripId, traveler),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: travelerKeys.byTrip(tripId) }),
  })
}

export function useUpdateTraveler() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      traveler,
    }: {
      id: string
      tripId: string
      traveler: Partial<TravelerCreate>
    }) => travelersService.update(id, traveler),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: travelerKeys.byTrip(tripId) }),
  })
}

export function useDeleteTraveler() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; tripId: string }) => travelersService.delete(id),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: travelerKeys.byTrip(tripId) }),
  })
}
