import { supabase } from '@/lib/supabase'
import type { Flight, FlightCreate } from './flightsTypes'

export const flightsService = {
  async getByTrip(tripId: string): Promise<Flight[]> {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('trip_id', tripId)
      .order('departure_at', { ascending: true })
    if (error) throw error
    return data
  },

  async create(tripId: string, flight: FlightCreate): Promise<Flight> {
    const { data, error } = await supabase
      .from('flights')
      .insert({
        ...flight,
        trip_id: tripId,
        from_iata: flight.from_iata.toUpperCase(),
        to_iata: flight.to_iata.toUpperCase(),
        traveler_id: flight.traveler_id || null,
        booking_url: flight.booking_url || null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, flight: Partial<FlightCreate>): Promise<Flight> {
    const payload = {
      ...flight,
      ...(flight.from_iata && { from_iata: flight.from_iata.toUpperCase() }),
      ...(flight.to_iata && { to_iata: flight.to_iata.toUpperCase() }),
      ...(flight.traveler_id !== undefined && { traveler_id: flight.traveler_id || null }),
      ...(flight.booking_url !== undefined && { booking_url: flight.booking_url || null }),
    }
    const { data, error } = await supabase
      .from('flights')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('flights').delete().eq('id', id)
    if (error) throw error
  },
}
