import { supabase } from '@/lib/supabase'
import type { Expense, ExpenseCreate } from './expensesTypes'

export const expensesService = {
  async getByTrip(tripId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },

  async create(tripId: string, expense: ExpenseCreate): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        trip_id: tripId,
        paid_by: expense.paid_by || null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, expense: Partial<ExpenseCreate>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...expense,
        ...(expense.paid_by !== undefined && { paid_by: expense.paid_by || null }),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) throw error
  },
}
