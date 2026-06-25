import { cn } from '@/lib/cn';
import type { BudgetLevel } from '@/types';

interface ProgressBarProps {
  /** 0..1 (values >1 are clamped for the bar width but color still reflects "over"). */
  ratio: number;
  level?: BudgetLevel;
  className?: string;
}

const LEVEL_COLOR: Record<BudgetLevel, string> = {
  none: 'bg-brand',
  ok: 'bg-emerald-500',
  warn: 'bg-amber-500',
  over: 'bg-red-500',
};

export function ProgressBar({ ratio, level = 'none', className }: ProgressBarProps) {
  const width = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div className={cn('h-2.5 w-full rounded-full bg-border/70 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', LEVEL_COLOR[level])}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
