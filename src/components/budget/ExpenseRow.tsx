import { useState } from 'react'
import { Pencil, Trash2, X, Check } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ExpenseForm } from './ExpenseForm'
import { useUpdateExpense, useDeleteExpense } from '@/features/budget/expensesQueries'
import { CATEGORY_META } from '@/features/budget/expensesTypes'
import type { Expense, ExpenseFormValues, ExpenseCategory } from '@/features/budget/expensesTypes'
import type { Traveler } from '@/features/travelers/travelersTypes'

interface ExpenseRowProps {
  expense: Expense
  tripId: string
  travelers: Traveler[]
}

export function ExpenseRow({ expense, tripId, travelers }: ExpenseRowProps) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const updateExpense = useUpdateExpense()
  const deleteExpense = useDeleteExpense()

  const meta = CATEGORY_META[expense.category as ExpenseCategory] ?? CATEGORY_META.other
  const paidBy = travelers.find((t) => t.id === expense.paid_by)

  function handleUpdate(values: ExpenseFormValues) {
    updateExpense.mutate(
      {
        id: expense.id,
        tripId,
        expense: { ...values, paid_by: values.paid_by || null },
      },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleDelete() {
    deleteExpense.mutate({ id: expense.id, tripId })
  }

  if (editing) {
    return (
      <div className="border border-amber/40 rounded-xl p-4 space-y-3">
        <ExpenseForm
          defaultValues={{
            category: expense.category as ExpenseCategory,
            description: expense.description,
            amount: expense.amount,
            currency: expense.currency,
            paid_by: expense.paid_by ?? '',
            date: expense.date,
          }}
          travelers={travelers}
          onSubmit={handleUpdate}
          isPending={updateExpense.isPending}
          submitLabel="Save"
        />
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {/* Category badge */}
      <span
        className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${meta.badgeCls}`}
      >
        {meta.label}
      </span>

      {/* Description + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-navy truncate">{expense.description}</p>
        <p className="text-xs text-muted">
          {format(new Date(expense.date), 'dd MMM yyyy')}
          {paidBy && <span className="ml-1.5">· {paidBy.name}</span>}
        </p>
      </div>

      {/* Amount */}
      <span className="text-sm font-semibold text-navy shrink-0 tabular-nums">
        {expense.amount.toLocaleString()} {expense.currency}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {confirmDelete ? (
          <>
            <Button
              variant="coral"
              size="icon"
              className="h-7 w-7"
              onClick={handleDelete}
              disabled={deleteExpense.isPending}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setConfirmDelete(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5 text-muted" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5 text-coral" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
