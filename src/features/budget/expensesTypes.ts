import { z } from 'zod'
import type { Tables } from '@/types/supabase'

export type Expense = Tables<'expenses'>

export const EXPENSE_CATEGORIES = [
  'flights',
  'accommodation',
  'food',
  'transport',
  'activities',
  'other',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; badgeCls: string; barCls: string }
> = {
  flights: {
    label: 'Flights',
    badgeCls: 'bg-amber/20 text-amber',
    barCls: 'bg-amber',
  },
  accommodation: {
    label: 'Accommodation',
    badgeCls: 'bg-navy/10 text-navy',
    barCls: 'bg-navy',
  },
  food: {
    label: 'Food',
    badgeCls: 'bg-coral/20 text-coral',
    barCls: 'bg-coral',
  },
  transport: {
    label: 'Transport',
    badgeCls: 'bg-blue-100 text-blue-600',
    barCls: 'bg-blue-500',
  },
  activities: {
    label: 'Activities',
    badgeCls: 'bg-emerald-100 text-emerald-600',
    barCls: 'bg-emerald-500',
  },
  other: {
    label: 'Other',
    badgeCls: 'bg-border text-muted',
    barCls: 'bg-muted',
  },
}

export type ExpenseCreate = {
  category: string
  description: string
  amount: number
  currency: string
  paid_by?: string | null
  date: string
}

export const expenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  description: z.string().min(1, 'Required'),
  amount: z.number().min(0, 'Must be ≥ 0'),
  currency: z.string().min(1, 'Required'),
  paid_by: z.union([z.literal(''), z.string()]).optional(),
  date: z.string().min(1, 'Required'),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>
