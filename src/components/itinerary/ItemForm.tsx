import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { itemSchema, ITEM_CATEGORIES, ITEM_CATEGORY_META } from '@/features/itinerary/itineraryTypes'
import type { ItemFormValues } from '@/features/itinerary/itineraryTypes'
import { Button } from '@/components/ui/button'

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

interface ItemFormProps {
  defaultValues?: Partial<ItemFormValues>
  onSubmit: (values: ItemFormValues) => void
  isPending?: boolean
  submitLabel?: string
}

export function ItemForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Add Item',
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: '',
      category: 'activity',
      time: '',
      description: '',
      location: '',
      cost: undefined,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Title */}
      <Field label="Title" required error={errors.title?.message}>
        <input {...register('title')} placeholder="Senso-ji Temple visit" className={inputCls} />
      </Field>

      {/* Category + Time */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Category" required error={errors.category?.message}>
          <select {...register('category')} className={inputCls}>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {ITEM_CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Time" error={errors.time?.message}>
          <input {...register('time')} type="time" className={inputCls} />
        </Field>
      </div>

      {/* Location */}
      <Field label="Location" error={errors.location?.message}>
        <input
          {...register('location')}
          placeholder="Asakusa, Tokyo"
          className={inputCls}
        />
      </Field>

      {/* Description */}
      <Field label="Notes" error={errors.description?.message}>
        <textarea
          {...register('description')}
          placeholder="Any notes or details…"
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </Field>

      {/* Cost */}
      <Field label="Cost" error={errors.cost?.message}>
        <input
          {...register('cost')}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          className={`${inputCls} max-w-[160px]`}
        />
      </Field>

      <Button type="submit" variant="amber" size="sm" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
