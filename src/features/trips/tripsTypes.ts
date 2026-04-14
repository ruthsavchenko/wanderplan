import { z } from 'zod'

export interface Trip {
  id: string
  user_id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  currency: string
  cover_image_url?: string | null
  created_at: string
}

export interface TripCreate {
  title: string
  destination: string
  start_date: string
  end_date: string
  currency: string
  cover_image_url?: string | null
}

export const tripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  destination: z.string().min(1, 'Destination is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  currency: z.string().min(1, 'Currency is required'),
  cover_image_url: z.string().optional(),
})

export type TripFormValues = z.infer<typeof tripSchema>
