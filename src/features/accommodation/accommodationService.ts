import { supabase } from '@/lib/supabase'
import type { Accommodation, AccommodationCreate } from './accommodationTypes'

export const accommodationService = {
  async getByTrip(tripId: string): Promise<Accommodation[]> {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('trip_id', tripId)
      .order('check_in', { ascending: true })
    if (error) throw error
    return data
  },

  async create(tripId: string, accommodation: AccommodationCreate): Promise<Accommodation> {
    const { data, error } = await supabase
      .from('accommodations')
      .insert({
        ...accommodation,
        trip_id: tripId,
        booking_url: accommodation.booking_url || null,
        confirmation_code: accommodation.confirmation_code || null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, accommodation: Partial<AccommodationCreate>): Promise<Accommodation> {
    const { data, error } = await supabase
      .from('accommodations')
      .update({
        ...accommodation,
        ...(accommodation.booking_url !== undefined && {
          booking_url: accommodation.booking_url || null,
        }),
        ...(accommodation.confirmation_code !== undefined && {
          confirmation_code: accommodation.confirmation_code || null,
        }),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('accommodations').delete().eq('id', id)
    if (error) throw error
  },
}
