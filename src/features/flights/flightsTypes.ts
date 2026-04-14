import { z } from 'zod'
import type { Tables } from '@/types/supabase'

export type Flight = Tables<'flights'>

export type FlightCreate = {
  from_iata: string
  to_iata: string
  departure_at: string
  arrival_at: string
  airline: string
  flight_number: string
  price: number
  currency: string
  is_return: boolean
  traveler_id?: string | null
  booking_url?: string | null
}

export const flightSchema = z.object({
  from_iata: z.string().min(2, 'Min 2 chars').max(4, 'Max 4 chars'),
  to_iata: z.string().min(2, 'Min 2 chars').max(4, 'Max 4 chars'),
  departure_at: z.string().min(1, 'Required'),
  arrival_at: z.string().min(1, 'Required'),
  airline: z.string().min(1, 'Required'),
  flight_number: z.string().min(1, 'Required'),
  price: z.coerce.number().min(0, 'Must be ≥ 0'),
  currency: z.string().min(1, 'Required'),
  is_return: z.boolean(),
  traveler_id: z.union([z.literal(''), z.string()]).optional(),
  booking_url: z.union([z.literal(''), z.url('Invalid URL')]).optional(),
})

export type FlightFormValues = z.infer<typeof flightSchema>
