import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesService } from './expensesService'
import type { ExpenseCreate } from './expensesTypes'

export const expenseKeys = {
  byTrip: (tripId: string) => ['expenses', tripId] as const,
}

export function useExpenses(tripId: string) {
  return useQuery({
    queryKey: expenseKeys.byTrip(tripId),
    queryFn: () => expensesService.getByTrip(tripId),
    enabled: !!tripId,
  })
}

export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, expense }: { tripId: string; expense: ExpenseCreate }) =>
      expensesService.create(tripId, expense),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: expenseKeys.byTrip(tripId) }),
  })
}

export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      expense,
    }: {
      id: string
      tripId: string
      expense: Partial<ExpenseCreate>
    }) => expensesService.update(id, expense),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: expenseKeys.byTrip(tripId) }),
  })
}

export function useDeleteExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; tripId: string }) => expensesService.delete(id),
    onSuccess: (_, { tripId }) =>
      qc.invalidateQueries({ queryKey: expenseKeys.byTrip(tripId) }),
  })
}
