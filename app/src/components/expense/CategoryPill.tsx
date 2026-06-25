import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { cn } from '@/lib/cn';
import type { Category } from '@/types';

/** Small colored chip with the category icon + name. */
export function CategoryPill({ category, className }: { category: Category; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        className,
      )}
      style={{ backgroundColor: `${category.color}1f`, color: category.color }}
    >
      <CategoryIcon name={category.icon} size={13} />
      {category.name}
    </span>
  );
}

/** Rounded square icon badge in the category color. */
export function CategoryBadge({ category, size = 40 }: { category: Category; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl"
      style={{ width: size, height: size, backgroundColor: `${category.color}1f`, color: category.color }}
    >
      <CategoryIcon name={category.icon} size={Math.round(size * 0.45)} />
    </span>
  );
}
