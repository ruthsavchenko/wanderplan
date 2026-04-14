import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tripSchema, type TripFormValues } from '@/features/trips/tripsTypes'
import { Button } from '@/components/ui/button'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH', 'JPY', 'CAD', 'AUD', 'CHF']

interface TripFormProps {
  defaultValues?: Partial<TripFormValues>
  onSubmit: (values: TripFormValues) => void
  isPending: boolean
  submitLabel?: string
}

export function TripForm({ defaultValues, onSubmit, isPending, submitLabel = 'Save' }: TripFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: { currency: 'USD', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Trip title" error={errors.title?.message}>
        <input
          {...register('title')}
          placeholder="Tokyo Spring 2025"
          className={inputCls(!!errors.title)}
        />
      </Field>

      <Field label="Destination" error={errors.destination?.message}>
        <input
          {...register('destination')}
          placeholder="Tokyo, Japan"
          className={inputCls(!!errors.destination)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date" error={errors.start_date?.message}>
          <input
            type="date"
            {...register('start_date')}
            className={inputCls(!!errors.start_date)}
          />
        </Field>
        <Field label="End date" error={errors.end_date?.message}>
          <input
            type="date"
            {...register('end_date')}
            className={inputCls(!!errors.end_date)}
          />
        </Field>
      </div>

      <Field label="Currency" error={errors.currency?.message}>
        <select {...register('currency')} className={inputCls(!!errors.currency)}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Button type="submit" variant="amber" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}

function inputCls(hasError: boolean) {
  return [
    'w-full h-10 rounded-md border bg-surface px-3 text-sm text-navy placeholder:text-muted',
    'focus:outline-none focus:ring-2 focus:ring-navy/30',
    hasError ? 'border-coral' : 'border-border',
  ].join(' ')
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-navy">{label}</label>
      {children}
      {error && <p className="text-xs text-coral">{error}</p>}
    </div>
  )
}
