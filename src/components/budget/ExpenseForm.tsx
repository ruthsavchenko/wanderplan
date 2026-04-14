import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { expenseSchema, EXPENSE_CATEGORIES, CATEGORY_META } from '@/features/budget/expensesTypes'
import type { ExpenseFormValues } from '@/features/budget/expensesTypes'
import type { Traveler } from '@/features/travelers/travelersTypes'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH', 'JPY', 'CAD', 'AUD', 'CHF']

const inputCls =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber/40'

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted uppercase tracking-wider">
        {label} {required && <span className="text-coral">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-coral">{error}</p>}
    </div>
  )
}

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormValues>
  travelers: Traveler[]
  defaultCurrency?: string
  onSubmit: (values: ExpenseFormValues) => void
  isPending?: boolean
  submitLabel?: string
}

export function ExpenseForm({
  defaultValues,
  travelers,
  defaultCurrency = 'USD',
  onSubmit,
  isPending,
  submitLabel = 'Add Expense',
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: 'other',
      description: '',
      amount: 0,
      currency: defaultCurrency,
      paid_by: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Description */}
      <Field label="Description" required error={errors.description?.message}>
        <input
          {...register('description')}
          placeholder="Sushi dinner, Shinjuku"
          className={inputCls}
        />
      </Field>

      {/* Category + Date */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Category" required error={errors.category?.message}>
          <select {...register('category')} className={inputCls}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date" required error={errors.date?.message}>
          <input {...register('date')} type="date" className={inputCls} />
        </Field>
      </div>

      {/* Amount + Currency */}
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <Field label="Amount" required error={errors.amount?.message}>
          <input
            {...register('amount')}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className={inputCls}
          />
        </Field>
        <Field label="Currency" required error={errors.currency?.message}>
          <select {...register('currency')} className={inputCls}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Paid by */}
      {travelers.length > 0 && (
        <Field label="Paid by" error={errors.paid_by?.message}>
          <select {...register('paid_by')} className={inputCls}>
            <option value="">— Unknown —</option>
            {travelers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Button type="submit" variant="amber" size="sm" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
