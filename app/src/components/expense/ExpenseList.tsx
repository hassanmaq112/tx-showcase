import { useMemo } from 'react';
import { ExpenseCard } from './ExpenseCard';
import { groupExpensesByDay } from '@/lib/dates';
import { formatMoney, roundMoney } from '@/lib/currency';
import type { Category, Expense } from '@/types';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Map<string, Category>;
  currency: string;
  onSelect: (expense: Expense) => void;
  onReceiptClick?: (expense: Expense) => void;
  /** Show a per-day subtotal in each section header. */
  showDayTotals?: boolean;
}

export function ExpenseList({
  expenses,
  categories,
  currency,
  onSelect,
  onReceiptClick,
  showDayTotals = true,
}: ExpenseListProps) {
  const groups = useMemo(() => groupExpensesByDay(expenses), [expenses]);

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => {
        const dayTotal = roundMoney(group.expenses.reduce((acc, e) => acc + e.amount, 0));
        return (
          <section key={group.dateISO}>
            <div className="flex items-baseline justify-between px-4 pb-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {group.label}
              </h3>
              {showDayTotals && (
                <span className="text-xs font-medium tabular-nums text-muted">
                  {formatMoney(dayTotal, currency)}
                </span>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card divide-y divide-border">
              {group.expenses.map((expense) => {
                const category =
                  categories.get(expense.categoryId) ??
                  ({
                    id: expense.categoryId,
                    name: 'Deleted',
                    icon: 'CircleDashed',
                    color: '#94a3b8',
                    isCustom: true,
                  } as Category);
                return (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    category={category}
                    currency={currency}
                    onClick={onSelect}
                    onReceiptClick={onReceiptClick}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
