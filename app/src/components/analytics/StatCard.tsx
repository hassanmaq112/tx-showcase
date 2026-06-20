import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  hint?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, hint, className }: StatCardProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface p-4 shadow-card', className)}>
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-ink">{value}</p>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}
