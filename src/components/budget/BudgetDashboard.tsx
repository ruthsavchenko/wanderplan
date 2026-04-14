import { useMemo, useState } from 'react'
import { PlusCircle, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseRow } from './ExpenseRow'
import { useExpenses, useCreateExpense } from '@/features/budget/expensesQueries'
import { useTravelers } from '@/features/travelers/travelersQueries'
import { EXPENSE_CATEGORIES, CATEGORY_META } from '@/features/budget/expensesTypes'
import type { ExpenseFormValues, ExpenseCategory } from '@/features/budget/expensesTypes'

interface BudgetDashboardProps {
  tripId: string
  defaultCurrency?: string
}

export function BudgetDashboard({ tripId, defaultCurrency = 'USD' }: BudgetDashboardProps) {
  const [adding, setAdding] = useState(false)

  const { data: expenses = [], isLoading } = useExpenses(tripId)
  const { data: travelers = [] } = useTravelers(tripId)
  const createExpense = useCreateExpense()

  function handleAdd(values: ExpenseFormValues) {
    createExpense.mutate(
      { tripId, expense: { ...values, paid_by: values.paid_by || null } },
      { onSuccess: () => setAdding(false) }
    )
  }

  // --- computed ---
  const totalByCurrency = useMemo(() => {
    return expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.currency] = (acc[e.currency] ?? 0) + e.amount
      return acc
    }, {})
  }, [expenses])

  const categoryBreakdown = useMemo(() => {
    const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0)
    return EXPENSE_CATEGORIES.map((cat) => {
      const total = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0)
      return {
        category: cat as ExpenseCategory,
        total,
        pct: grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0,
      }
    }).filter((c) => c.total > 0)
  }, [expenses])

  const primaryTotal = totalByCurrency[defaultCurrency] ?? 0
  const otherCurrencies = Object.entries(totalByCurrency).filter(
    ([cur]) => cur !== defaultCurrency
  )

  return (
    <section className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg text-navy">Budget</h2>
          {expenses.length > 0 && (
            <span className="text-xs font-semibold text-muted bg-border/60 rounded-full px-2 py-0.5">
              {expenses.length}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setAdding((v) => !v)}>
          <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
          Add Expense
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="px-5 py-4 border-b border-border bg-bg">
          <ExpenseForm
            travelers={travelers}
            defaultCurrency={defaultCurrency}
            onSubmit={handleAdd}
            isPending={createExpense.isPending}
          />
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setAdding(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Body */}
      {isLoading ? (
        <div className="p-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-border/40 animate-pulse" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={Wallet}
            title="No expenses yet"
            description="Track what you spend on flights, food, activities and more."
          />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="px-5 py-4 border-b border-border bg-bg grid sm:grid-cols-2 gap-4">
            {/* Total spent */}
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                Total Spent
              </p>
              <p className="font-display text-3xl text-navy">
                {primaryTotal.toLocaleString()}
                <span className="text-lg text-muted ml-1.5">{defaultCurrency}</span>
              </p>
              {otherCurrencies.length > 0 && (
                <p className="text-xs text-muted">
                  +{' '}
                  {otherCurrencies
                    .map(([cur, amt]) => `${amt.toLocaleString()} ${cur}`)
                    .join(', ')}
                </p>
              )}
            </div>

            {/* Per-traveler split */}
            {travelers.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                  By Traveler
                </p>
                {travelers.map((t) => {
                  const total = expenses
                    .filter((e) => e.paid_by === t.id)
                    .reduce((sum, e) => sum + e.amount, 0)
                  if (total === 0) return null
                  return (
                    <div key={t.id} className="flex justify-between text-sm">
                      <span className="text-navy">{t.name}</span>
                      <span className="font-medium text-navy tabular-nums">
                        {total.toLocaleString()} {defaultCurrency}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Category breakdown */}
          {categoryBreakdown.length > 0 && (
            <div className="px-5 py-4 border-b border-border space-y-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                By Category
              </p>
              {categoryBreakdown.map(({ category, total, pct }) => {
                const meta = CATEGORY_META[category]
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-navy font-medium">{meta.label}</span>
                      <span className="text-muted tabular-nums">
                        {total.toLocaleString()} · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${meta.barCls} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Expense list */}
          <div className="px-5">
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                tripId={tripId}
                travelers={travelers}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
