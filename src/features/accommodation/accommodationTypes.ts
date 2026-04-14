import { z } from 'zod'
import type { Tables } from '@/types/supabase'

export type Accommodation = Tables<'accommodations'>

export type AccommodationCreate = {
  name: string
  address: string
  check_in: string
  check_out: string
  price_per_night: number
  currency: string
  booking_url?: string | null
  confirmation_code?: string | null
}

export const accommodationSchema = z.object({
  name: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  check_in: z.string().min(1, 'Required'),
  check_out: z.string().min(1, 'Required'),
  price_per_night: z.number().min(0, 'Must be ≥ 0'),
  currency: z.string().min(1, 'Required'),
  booking_url: z.union([z.literal(''), z.url('Invalid URL')]).optional(),
  confirmation_code: z.string().optional(),
})

export type AccommodationFormValues = z.infer<typeof accommodationSchema>
