import { CategoryBadge } from '@/components/expense/CategoryPill';
import { formatMoney } from '@/lib/currency';
import type { CategoryBreakdownItem } from '@/types';

interface TopCategoriesProps {
  data: CategoryBreakdownItem[];
  currency: string;
}

/** Ranked horizontal-bar list of categories with share-of-spend. */
export function TopCategories({ data, currency }: TopCategoriesProps) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <div key={item.category.id} className="flex items-center gap-3">
          <CategoryBadge category={item.category} size={36} />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="truncate font-medium text-ink">{item.category.name}</span>
              <span className="tabular-nums text-muted">
                {formatMoney(item.total, currency)}{' '}
                <span className="text-xs">· {item.percent}%</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/70">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.percent}%`, backgroundColor: item.category.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
