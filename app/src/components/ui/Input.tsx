import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Optional leading adornment, e.g. a currency symbol. */
  prefix?: ReactNode;
  invalid?: boolean;
}

const base =
  'w-full h-11 rounded-xl bg-surface border text-ink placeholder:text-muted ' +
  'outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { prefix, invalid, className, ...props },
  ref,
) {
  if (prefix != null) {
    return (
      <div
        className={cn(
          'flex items-center h-11 rounded-xl bg-surface border transition-colors',
          'focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30',
          invalid ? 'border-red-400' : 'border-border',
        )}
      >
        <span className="pl-3 pr-1 text-muted select-none">{prefix}</span>
        <input
          ref={ref}
          className={cn('flex-1 h-full bg-transparent pr-3 outline-none text-ink', className)}
          {...props}
        />
      </div>
    );
  }
  return (
    <input
      ref={ref}
      className={cn(base, invalid ? 'border-red-400' : 'border-border', 'px-3', className)}
      {...props}
    />
  );
});
