import { Suspense, type ReactNode } from 'react';
import { Spinner } from '@/components/ui/Spinner';

/** Wraps lazily-loaded Recharts components so they only load on the Stats tab. */
export function ChartContainer({ children, height = 240 }: { children: ReactNode; height?: number }) {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center" style={{ height }}>
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
