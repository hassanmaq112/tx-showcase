import { ProgressBar } from '@/components/ui/ProgressBar';
import { CategoryBadge } from '@/components/expense/CategoryPill';
import { formatMoney } from '@/lib/currency';
import { cn } from '@/lib/cn';
import type { BudgetStatus, Category } from '@/types';

interface CategoryBudgetRowProps {
  category: Category;
  status: BudgetStatus;
  currency: string;
}

export function CategoryBudgetRow({ category, status, currency }: CategoryBudgetRowProps) {
  if (status.limit == null) return null;
  const over = status.level === 'over';

  return (
    <div className="flex items-center gap-3 py-3">
      <CategoryBadge category={category} size={36} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="truncate text-sm font-medium text-ink">{category.name}</span>
          <span className={cn('text-xs tabular-nums', over ? 'text-red-500 font-medium' : 'text-muted')}>
            {formatMoney(status.spent, currency)} / {formatMoney(status.limit, currency)}
          </span>
        </div>
        <ProgressBar ratio={status.ratio} level={status.level} className="h-2" />
      </div>
    </div>
  );
}
