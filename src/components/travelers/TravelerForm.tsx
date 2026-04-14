import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { travelerSchema } from '@/features/travelers/travelersTypes'
import type { TravelerFormValues } from '@/features/travelers/travelersTypes'
import { Button } from '@/components/ui/button'

interface TravelerFormProps {
  defaultValues?: Partial<TravelerFormValues>
  onSubmit: (values: TravelerFormValues) => void
  isPending?: boolean
  submitLabel?: string
}

export function TravelerForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Add Traveler',
}: TravelerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TravelerFormValues>({
    resolver: zodResolver(travelerSchema),
    defaultValues: { name: '', email: '', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">
            Name <span className="text-coral">*</span>
          </label>
          <input
            {...register('name')}
            placeholder="Jane Smith"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
          {errors.name && (
            <p className="text-xs text-coral">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
          {errors.email && (
            <p className="text-xs text-coral">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" variant="amber" size="sm" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
