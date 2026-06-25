import { AlertTriangle, Wallet } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatMoney } from '@/lib/currency';
import { cn } from '@/lib/cn';
import type { BudgetStatus } from '@/types';

interface BudgetBarProps {
  status: BudgetStatus;
  currency: string;
}

export function BudgetBar({ status, currency }: BudgetBarProps) {
  if (status.limit == null) return null;

  const over = status.level === 'over';
  const warn = status.level === 'warn';

  return (
    <div
      className={cn(
        'rounded-2xl border bg-surface p-4 shadow-card',
        over ? 'border-red-400/60' : warn ? 'border-amber-400/50' : 'border-border',
      )}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Wallet size={16} />
          Monthly budget
        </div>
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            over ? 'text-red-500' : 'text-ink',
          )}
        >
          {formatMoney(status.spent, currency)}{' '}
          <span className="font-normal text-muted">/ {formatMoney(status.limit, currency)}</span>
        </span>
      </div>

      <ProgressBar ratio={status.ratio} level={status.level} />

      <div className="mt-2 flex items-center justify-between text-xs">
        {over ? (
          <span className="flex items-center gap-1 font-medium text-red-500">
            <AlertTriangle size={13} />
            {formatMoney(status.spent - status.limit, currency)} over budget
          </span>
        ) : (
          <span className="text-muted">
            {formatMoney(Math.max(0, status.remaining), currency)} left
          </span>
        )}
        <span className={cn('tabular-nums', warn || over ? 'font-medium' : 'text-muted')}>
          {Math.round(status.ratio * 100)}%
        </span>
      </div>
    </div>
  );
}
