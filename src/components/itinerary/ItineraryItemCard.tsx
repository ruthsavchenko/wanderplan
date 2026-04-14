import { useState } from 'react'
import { Pencil, Trash2, X, Check, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ItemForm } from './ItemForm'
import { useUpdateItem, useDeleteItem } from '@/features/itinerary/itineraryQueries'
import { ITEM_CATEGORY_META } from '@/features/itinerary/itineraryTypes'
import type { ItineraryItem, ItemCategory, ItemFormValues } from '@/features/itinerary/itineraryTypes'

interface ItineraryItemCardProps {
  item: ItineraryItem
  tripId: string
}

export function ItineraryItemCard({ item, tripId }: ItineraryItemCardProps) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updateItem = useUpdateItem()
  const deleteItem = useDeleteItem()

  const meta = ITEM_CATEGORY_META[item.category as ItemCategory] ?? ITEM_CATEGORY_META.activity

  function handleUpdate(values: ItemFormValues) {
    updateItem.mutate(
      {
        id: item.id,
        tripId,
        item: {
          title: values.title,
          category: values.category,
          time: values.time || null,
          description: values.description || null,
          location: values.location || null,
          cost: values.cost ?? null,
        },
      },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    deleteItem.mutate({ id: item.id, tripId })
  }

  if (editing) {
    return (
      <div className="ml-10 border border-amber/40 rounded-xl p-4 space-y-3">
        <ItemForm
          defaultValues={{
            title: item.title,
            category: item.category as ItemCategory,
            time: item.time ?? '',
            description: item.description ?? '',
            location: item.location ?? '',
            cost: item.cost ?? undefined,
          }}
          onSubmit={handleUpdate}
          isPending={updateItem.isPending}
          submitLabel="Save"
        />
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 group">
      {/* Time column */}
      <div className="w-10 shrink-0 text-right">
        <span className="text-xs text-muted tabular-nums">
          {item.time ? item.time.slice(0, 5) : ''}
        </span>
      </div>

      {/* Dot */}
      <div className="flex flex-col items-center shrink-0 mt-1">
        <div className={`h-2 w-2 rounded-full shrink-0 ${meta.dotCls}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-navy">{item.title}</span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${meta.badgeCls}`}
              >
                {meta.label}
              </span>
            </div>

            {item.location && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted">
                <MapPin className="h-3 w-3 shrink-0" />
                {item.location}
              </div>
            )}

            {item.description && (
              <p className="text-xs text-muted mt-0.5">{item.description}</p>
            )}

            {item.cost != null && (
              <p className="text-xs font-medium text-navy mt-0.5">
                {item.cost.toLocaleString()}
              </p>
            )}
          </div>

          {/* Actions — visible on hover */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {confirmDelete ? (
              <>
                <Button
                  variant="coral"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleDelete}
                  disabled={deleteItem.isPending}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setConfirmDelete(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-3 w-3 text-muted" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-3 w-3 text-coral" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
