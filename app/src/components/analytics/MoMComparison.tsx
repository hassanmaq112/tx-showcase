import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { formatMoney } from '@/lib/currency';
import { cn } from '@/lib/cn';
import type { MonthOverMonth } from '@/types';

export function MoMComparison({ data, currency }: { data: MonthOverMonth; currency: string }) {
  const { current, previous, deltaPct } = data;
  // Spending less than last month is "good" (green); more is "bad" (red).
  const up = deltaPct != null && deltaPct > 0;
  const flat = deltaPct == null || deltaPct === 0;
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
  const tone = flat ? 'text-muted' : up ? 'text-red-500' : 'text-emerald-500';

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">vs last month</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-ink">
            {formatMoney(current, currency)}
          </p>
        </div>
        <div className={cn('flex items-center gap-1 text-sm font-semibold', tone)}>
          <Icon size={18} />
          {deltaPct == null ? '—' : `${up ? '+' : ''}${deltaPct}%`}
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">
        Last month: {formatMoney(previous, currency)}
      </p>
    </div>
  );
}
