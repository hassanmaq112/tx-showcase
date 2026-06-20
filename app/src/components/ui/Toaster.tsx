import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/cn';
import type { ToastVariant } from '@/types';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warn: AlertTriangle,
  info: Info,
} as const;

const ACCENT: Record<ToastVariant, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  warn: 'text-amber-500',
  info: 'text-brand',
};

export function Toaster() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-safe">
      <div className="h-2" />
      {toasts.map((t) => {
        const Icon = ICONS[t.variant];
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl',
              'border border-border bg-elevated px-3.5 py-3 shadow-card animate-toast-in',
            )}
            role="status"
          >
            <Icon size={20} className={cn('shrink-0', ACCENT[t.variant])} />
            <p className="flex-1 text-sm text-ink">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="grid h-6 w-6 place-items-center rounded-full text-muted no-tap-highlight"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
