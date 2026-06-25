import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  /** Optional leading element, e.g. a back button. */
  leading?: ReactNode;
  className?: string;
}

export function ScreenHeader({ title, subtitle, action, leading, className }: ScreenHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 bg-canvas/85 backdrop-blur-lg border-b border-border/60 pt-safe',
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {leading}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
