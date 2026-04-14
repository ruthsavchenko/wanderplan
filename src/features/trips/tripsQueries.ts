import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripsService } from './tripsService'
import type { TripCreate } from './tripsTypes'

export const tripKeys = {
  all: ['trips'] as const,
  detail: (id: string) => ['trips', id] as const,
}

export function useTrips() {
  return useQuery({
    queryKey: tripKeys.all,
    queryFn: tripsService.getAll,
  })
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => tripsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateTrip() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (trip: TripCreate) => tripsService.create(trip),
    onSuccess: () => qc.invalidateQueries({ queryKey: tripKeys.all }),
  })
}

export function useDeleteTrip() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tripsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tripKeys.all }),
  })
}
