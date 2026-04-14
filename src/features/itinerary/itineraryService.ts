import { supabase } from '@/lib/supabase'
import type { DayWithItems, ItineraryDay, ItineraryItem, ItemCreate } from './itineraryTypes'

export const itineraryService = {
  async getDaysWithItems(tripId: string): Promise<DayWithItems[]> {
    const { data, error } = await supabase
      .from('itinerary_days')
      .select('*, itinerary_items(*)')
      .eq('trip_id', tripId)
      .order('date', { ascending: true })
    if (error) throw error
    return (data as DayWithItems[]).map((day) => ({
      ...day,
      itinerary_items: [...day.itinerary_items].sort((a, b) =>
        (a.time ?? '99:99').localeCompare(b.time ?? '99:99')
      ),
    }))
  },

  async upsertDay(tripId: string, date: string): Promise<ItineraryDay> {
    const { data: existing } = await supabase
      .from('itinerary_days')
      .select('*')
      .eq('trip_id', tripId)
      .eq('date', date)
      .maybeSingle()
    if (existing) return existing

    const { data, error } = await supabase
      .from('itinerary_days')
      .insert({ trip_id: tripId, date })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateDayTitle(id: string, title: string): Promise<ItineraryDay> {
    const { data, error } = await supabase
      .from('itinerary_days')
      .update({ title: title || null })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async createItem(dayId: string, item: ItemCreate): Promise<ItineraryItem> {
    const { data, error } = await supabase
      .from('itinerary_items')
      .insert({
        ...item,
        day_id: dayId,
        time: item.time || null,
        description: item.description || null,
        location: item.location || null,
        cost: item.cost ?? null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateItem(id: string, item: Partial<ItemCreate>): Promise<ItineraryItem> {
    const { data, error } = await supabase
      .from('itinerary_items')
      .update({
        ...item,
        ...(item.time !== undefined && { time: item.time || null }),
        ...(item.description !== undefined && { description: item.description || null }),
        ...(item.location !== undefined && { location: item.location || null }),
        ...(item.cost !== undefined && { cost: item.cost ?? null }),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase.from('itinerary_items').delete().eq('id', id)
    if (error) throw error
  },
}
