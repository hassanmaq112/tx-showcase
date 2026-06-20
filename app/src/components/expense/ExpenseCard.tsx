import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { CategoryBadge } from './CategoryPill';
import { useReceiptUrl } from '@/hooks/useReceiptUrl';
import { formatMoney } from '@/lib/currency';
import type { Category, Expense } from '@/types';

interface ExpenseCardProps {
  expense: Expense;
  category: Category;
  currency: string;
  onClick: (expense: Expense) => void;
  onReceiptClick?: (expense: Expense) => void;
}

function ExpenseCardImpl({ expense, category, currency, onClick, onReceiptClick }: ExpenseCardProps) {
  const receiptUrl = useReceiptUrl(expense.receiptId);

  return (
    <button
      onClick={() => onClick(expense)}
      className="no-tap-highlight flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-elevated"
    >
      <CategoryBadge category={category} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{category.name}</p>
        {expense.notes ? (
          <p className="truncate text-sm text-muted">{expense.notes}</p>
        ) : (
          <p className="text-sm text-muted/70">No note</p>
        )}
      </div>

      {receiptUrl && (
        <img
          src={receiptUrl}
          alt="Receipt"
          onClick={(e) => {
            e.stopPropagation();
            onReceiptClick?.(expense);
          }}
          className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
        />
      )}

      <div className="flex shrink-0 items-center gap-1">
        <span className="font-semibold tabular-nums text-ink">
          {formatMoney(expense.amount, currency)}
        </span>
        <ChevronRight size={16} className="text-muted/60" />
      </div>
    </button>
  );
}

export const ExpenseCard = memo(ExpenseCardImpl);
