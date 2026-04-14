import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flightSchema } from '@/features/flights/flightsTypes'
import type { FlightFormValues } from '@/features/flights/flightsTypes'
import type { Traveler } from '@/features/travelers/travelersTypes'
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

interface FlightFormProps {
  defaultValues?: Partial<FlightFormValues>
  travelers: Traveler[]
  defaultCurrency?: string
  onSubmit: (values: FlightFormValues) => void
  isPending?: boolean
  submitLabel?: string
}

export function FlightForm({
  defaultValues,
  travelers,
  defaultCurrency = 'USD',
  onSubmit,
  isPending,
  submitLabel = 'Add Flight',
}: FlightFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      from_iata: '',
      to_iata: '',
      departure_at: '',
      arrival_at: '',
      airline: '',
      flight_number: '',
      price: 0,
      currency: defaultCurrency,
      is_return: false,
      traveler_id: '',
      booking_url: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Route */}
      <div className="grid grid-cols-[1fr_24px_1fr] gap-2 items-start">
        <Field label="From" required error={errors.from_iata?.message}>
          <input
            {...register('from_iata')}
            placeholder="WAW"
            maxLength={4}
            className={`${inputCls} uppercase`}
          />
        </Field>
        <div className="text-muted text-center pt-7">→</div>
        <Field label="To" required error={errors.to_iata?.message}>
          <input
            {...register('to_iata')}
            placeholder="NRT"
            maxLength={4}
            className={`${inputCls} uppercase`}
          />
        </Field>
      </div>

      {/* Times */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Departure" required error={errors.departure_at?.message}>
          <input {...register('departure_at')} type="datetime-local" className={inputCls} />
        </Field>
        <Field label="Arrival" required error={errors.arrival_at?.message}>
          <input {...register('arrival_at')} type="datetime-local" className={inputCls} />
        </Field>
      </div>

      {/* Airline + Flight number */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Airline" required error={errors.airline?.message}>
          <input
            {...register('airline')}
            placeholder="LOT Polish Airlines"
            className={inputCls}
          />
        </Field>
        <Field label="Flight number" required error={errors.flight_number?.message}>
          <input {...register('flight_number')} placeholder="LO781" className={inputCls} />
        </Field>
      </div>

      {/* Price + Currency */}
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <Field label="Price" required error={errors.price?.message}>
          <input
            {...register('price', { valueAsNumber: true })}
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

      {/* Traveler + Booking URL */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Traveler" error={errors.traveler_id?.message}>
          <select {...register('traveler_id')} className={inputCls}>
            <option value="">— None —</option>
            {travelers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
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

      {/* Return checkbox */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          {...register('is_return')}
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-amber"
        />
        <span className="text-sm text-navy">Return flight</span>
      </label>

      <Button type="submit" variant="amber" size="sm" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
