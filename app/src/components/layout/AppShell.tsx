import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Centers the app in a phone-width column on large screens and reserves space
 * for the fixed bottom nav. The scroll container is the page body.
 */
export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-canvas">
      <main className={cn('flex-1 pb-28', className)}>{children}</main>
    </div>
  );
}
