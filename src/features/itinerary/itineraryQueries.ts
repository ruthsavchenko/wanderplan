import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itineraryService } from './itineraryService'
import type { ItemCreate } from './itineraryTypes'

export const itineraryKeys = {
  byTrip: (tripId: string) => ['itinerary', tripId] as const,
}

export function useDaysWithItems(tripId: string) {
  return useQuery({
    queryKey: itineraryKeys.byTrip(tripId),
    queryFn: () => itineraryService.getDaysWithItems(tripId),
    enabled: !!tripId,
  })
}

export function useUpdateDayTitle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, title }: { id: string; tripId: string; title: string }) =>
      itineraryService.updateDayTitle(id, title),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: itineraryKeys.byTrip(tripId) }),
  })
}

export function useCreateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      tripId,
      date,
      dayId,
      item,
    }: {
      tripId: string
      date: string
      dayId?: string
      item: ItemCreate
    }) => {
      const resolvedDayId = dayId ?? (await itineraryService.upsertDay(tripId, date)).id
      return itineraryService.createItem(resolvedDayId, item)
    },
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: itineraryKeys.byTrip(tripId) }),
  })
}

export function useUpdateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, item }: { id: string; tripId: string; item: Partial<ItemCreate> }) =>
      itineraryService.updateItem(id, item),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: itineraryKeys.byTrip(tripId) }),
  })
}

export function useDeleteItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; tripId: string }) => itineraryService.deleteItem(id),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: itineraryKeys.byTrip(tripId) }),
  })
}
