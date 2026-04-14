import { z } from 'zod'
import type { Tables } from '@/types/supabase'

export type ItineraryDay = Tables<'itinerary_days'>
export type ItineraryItem = Tables<'itinerary_items'>

export type DayWithItems = ItineraryDay & {
  itinerary_items: ItineraryItem[]
}

export const ITEM_CATEGORIES = ['activity', 'food', 'transport', 'free'] as const
export type ItemCategory = (typeof ITEM_CATEGORIES)[number]

export const ITEM_CATEGORY_META: Record<
  ItemCategory,
  { label: string; badgeCls: string; dotCls: string }
> = {
  activity: {
    label: 'Activity',
    badgeCls: 'bg-amber/20 text-amber',
    dotCls: 'bg-amber',
  },
  food: {
    label: 'Food',
    badgeCls: 'bg-coral/20 text-coral',
    dotCls: 'bg-coral',
  },
  transport: {
    label: 'Transport',
    badgeCls: 'bg-blue-100 text-blue-600',
    dotCls: 'bg-blue-500',
  },
  free: {
    label: 'Free time',
    badgeCls: 'bg-emerald-100 text-emerald-600',
    dotCls: 'bg-emerald-500',
  },
}

export type ItemCreate = {
  title: string
  category: string
  time?: string | null
  description?: string | null
  location?: string | null
  cost?: number | null
}

export const itemSchema = z.object({
  title: z.string().min(1, 'Required'),
  category: z.enum(ITEM_CATEGORIES),
  time: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  cost: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z.number().min(0).nullable().optional()
  ),
})

export type ItemFormValues = z.infer<typeof itemSchema>
