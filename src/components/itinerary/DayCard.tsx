import { useState } from 'react'
import { Plus, Pencil, Check, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ItemForm } from './ItemForm'
import { ItineraryItemCard } from './ItineraryItemCard'
import { useCreateItem, useUpdateDayTitle } from '@/features/itinerary/itineraryQueries'
import type { DayWithItems, ItemFormValues } from '@/features/itinerary/itineraryTypes'

interface DayCardProps {
  dayNumber: number
  date: string
  day?: DayWithItems
  tripId: string
}

export function DayCard({ dayNumber, date, day, tripId }: DayCardProps) {
  const [addingItem, setAddingItem] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(day?.title ?? '')

  const createItem = useCreateItem()
  const updateDayTitle = useUpdateDayTitle()

  const parsedDate = parseISO(date)
  const items = day?.itinerary_items ?? []

  function handleAddItem(values: ItemFormValues) {
    createItem.mutate(
      {
        tripId,
        date,
        dayId: day?.id,
        item: {
          title: values.title,
          category: values.category,
          time: values.time || null,
          description: values.description || null,
          location: values.location || null,
          cost: values.cost ?? null,
        },
      },
      { onSuccess: () => setAddingItem(false) }
    )
  }

  function handleSaveTitle() {
    if (!day) return
    updateDayTitle.mutate(
      { id: day.id, tripId, title: titleValue },
      { onSuccess: () => setEditingTitle(false) }
    )
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Day header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 bg-surface border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          {/* Day number badge */}
          <span className="shrink-0 text-xs font-bold text-surface bg-navy rounded-full h-6 w-6 flex items-center justify-center">
            {dayNumber}
          </span>

          <div className="min-w-0">
            <p className="text-xs text-muted">
              {format(parsedDate, 'EEEE, d MMMM yyyy')}
            </p>
            {editingTitle ? (
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  placeholder="Day theme…"
                  className="text-sm text-navy border-b border-amber bg-transparent focus:outline-none w-40"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle()
                    if (e.key === 'Escape') setEditingTitle(false)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={handleSaveTitle}
                  disabled={updateDayTitle.isPending}
                >
                  <Check className="h-3 w-3 text-amber" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => {
                    setTitleValue(day?.title ?? '')
                    setEditingTitle(false)
                  }}
                >
                  <X className="h-3 w-3 text-muted" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 group/title">
                {day?.title ? (
                  <span className="text-sm font-medium text-navy">{day.title}</span>
                ) : (
                  <span className="text-sm text-muted/50 italic">Add theme…</span>
                )}
                {day && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 opacity-0 group-hover/title:opacity-100 transition-opacity"
                    onClick={() => {
                      setTitleValue(day.title ?? '')
                      setEditingTitle(true)
                    }}
                  >
                    <Pencil className="h-2.5 w-2.5 text-muted" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-muted hover:text-navy"
          onClick={() => setAddingItem((v) => !v)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>

      {/* Add item form */}
      {addingItem && (
        <div className="px-5 py-4 border-b border-border bg-bg">
          <ItemForm
            onSubmit={handleAddItem}
            isPending={createItem.isPending}
          />
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setAddingItem(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Items */}
      {items.length > 0 ? (
        <div className="px-5 pt-4 pb-2">
          {items.map((item) => (
            <ItineraryItemCard key={item.id} item={item} tripId={tripId} />
          ))}
        </div>
      ) : (
        !addingItem && (
          <div className="px-5 py-6 text-center text-xs text-muted/60 italic">
            No plans yet — tap Add to fill this day.
          </div>
        )
      )}
    </div>
  )
}
