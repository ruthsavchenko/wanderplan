import { supabase } from '@/lib/supabase'
import type { Trip, TripCreate } from './tripsTypes'

export const tripsService = {
  async getAll(): Promise<Trip[]> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id: string): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(trip: TripCreate): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .insert(trip)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, trip: Partial<TripCreate>): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .update(trip)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) throw error
  },
}
