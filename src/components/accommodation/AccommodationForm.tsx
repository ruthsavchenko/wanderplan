import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accommodationSchema } from '@/features/accommodation/accommodationTypes'
import type { AccommodationFormValues } from '@/features/accommodation/accommodationTypes'
import { Button } from '@/components/ui/button'

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

interface AccommodationFormProps {
  defaultValues?: Partial<AccommodationFormValues>
  defaultCurrency?: string
  onSubmit: (values: AccommodationFormValues) => void
  isPending?: boolean
  submitLabel?: string
}

export function AccommodationForm({
  defaultValues,
  defaultCurrency = 'USD',
  onSubmit,
  isPending,
  submitLabel = 'Add Accommodation',
}: AccommodationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      name: '',
      address: '',
      check_in: '',
      check_out: '',
      price_per_night: 0,
      currency: defaultCurrency,
      booking_url: '',
      confirmation_code: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <Field label="Property name" required error={errors.name?.message}>
        <input {...register('name')} placeholder="Hotel Shibuya Excel" className={inputCls} />
      </Field>

      {/* Address */}
      <Field label="Address" required error={errors.address?.message}>
        <input
          {...register('address')}
          placeholder="1-12-2 Dogenzaka, Shibuya, Tokyo"
          className={inputCls}
        />
      </Field>

      {/* Dates */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Check-in" required error={errors.check_in?.message}>
          <input {...register('check_in')} type="date" className={inputCls} />
        </Field>
        <Field label="Check-out" required error={errors.check_out?.message}>
          <input {...register('check_out')} type="date" className={inputCls} />
        </Field>
      </div>

      {/* Price + Currency */}
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <Field label="Price per night" required error={errors.price_per_night?.message}>
          <input
            {...register('price_per_night', { valueAsNumber: true })}
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

      {/* Confirmation code + Booking URL */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Confirmation code" error={errors.confirmation_code?.message}>
          <input
            {...register('confirmation_code')}
            placeholder="ABC123"
            className={inputCls}
          />
        </Field>
        <Field label="Booking URL" error={errors.booking_url?.message}>
          <input
            {...register('booking_url')}
            type="url"
            placeholder="https://..."
            className={inputCls}
          />
        </Field>
      </div>

      <Button type="submit" variant="amber" size="sm" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
