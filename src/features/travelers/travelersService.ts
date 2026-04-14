import { supabase } from '@/lib/supabase'
import type { Traveler, TravelerCreate } from './travelersTypes'

export const travelersService = {
  async getByTrip(tripId: string): Promise<Traveler[]> {
    const { data, error } = await supabase
      .from('travelers')
      .select('*')
      .eq('trip_id', tripId)
      .order('is_owner', { ascending: false })
    if (error) throw error
    return data
  },

  async create(tripId: string, traveler: TravelerCreate): Promise<Traveler> {
    const { data, error } = await supabase
      .from('travelers')
      .insert({ ...traveler, trip_id: tripId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, traveler: Partial<TravelerCreate>): Promise<Traveler> {
    const { data, error } = await supabase
      .from('travelers')
      .update(traveler)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('travelers').delete().eq('id', id)
    if (error) throw error
  },
}
