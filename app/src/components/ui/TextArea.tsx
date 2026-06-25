import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, rows = 3, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full rounded-xl bg-surface border border-border text-ink placeholder:text-muted',
        'px-3 py-2.5 outline-none resize-none transition-colors',
        'focus:border-brand focus:ring-2 focus:ring-brand/30',
        className,
      )}
      {...props}
    />
  );
});
