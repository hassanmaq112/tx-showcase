import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 'sheet' slides up from the bottom (default); 'full' covers the screen. */
  variant?: 'sheet' | 'full';
  title?: string;
  /** Hide the default close button (e.g. for fully custom chrome like the lightbox). */
  hideClose?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  variant = 'sheet',
  title,
  hideClose,
  className,
}: ModalProps) {
  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      {variant === 'full' ? (
        <div className={cn('relative z-10 flex w-full flex-col', className ?? 'bg-canvas')}>
          {children}
        </div>
      ) : (
        <div className="relative z-10 mt-auto w-full">
          <div
            className={cn(
              'animate-sheet-up rounded-t-2xl bg-canvas shadow-sheet pb-safe',
              'max-h-[90vh] overflow-y-auto',
              className,
            )}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-canvas/95 px-4 pt-3 pb-2 backdrop-blur">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border absolute left-1/2 -translate-x-1/2 top-2" />
              {title && <h2 className="text-base font-semibold text-ink">{title}</h2>}
              {!hideClose && (
                <button
                  onClick={onClose}
                  className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-elevated text-muted no-tap-highlight"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="px-4 pb-4">{children}</div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
