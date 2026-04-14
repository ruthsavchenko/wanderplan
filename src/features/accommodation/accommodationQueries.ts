import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accommodationService } from './accommodationService'
import type { AccommodationCreate } from './accommodationTypes'

export const accommodationKeys = {
  byTrip: (tripId: string) => ['accommodations', tripId] as const,
}

export function useAccommodations(tripId: string) {
  return useQuery({
    queryKey: accommodationKeys.byTrip(tripId),
    queryFn: () => accommodationService.getByTrip(tripId),
    enabled: !!tripId,
  })
}

export function useCreateAccommodation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      tripId,
      accommodation,
    }: {
      tripId: string
      accommodation: AccommodationCreate
    }) => accommodationService.create(tripId, accommodation),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: accommodationKeys.byTrip(tripId) }),
  })
}

export function useUpdateAccommodation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      accommodation,
    }: {
      id: string
      tripId: string
      accommodation: Partial<AccommodationCreate>
    }) => accommodationService.update(id, accommodation),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: accommodationKeys.byTrip(tripId) }),
  })
}

export function useDeleteAccommodation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; tripId: string }) => accommodationService.delete(id),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: accommodationKeys.byTrip(tripId) }),
  })
}
