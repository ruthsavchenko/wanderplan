import { z } from 'zod'
import type { Tables } from '@/types/supabase'

export type Traveler = Tables<'travelers'>

export type TravelerCreate = {
  name: string
  email?: string | null
  is_owner?: boolean
}

export const travelerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.union([z.literal(''), z.email('Invalid email format')]).optional(),
})

export type TravelerFormValues = z.infer<typeof travelerSchema>
