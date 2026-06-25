import { MoonStar } from 'lucide-react';

export function ThemeNote() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-card">
      <MoonStar size={18} className="text-muted" />
      <div>
        <p className="text-sm font-medium text-ink">Appearance</p>
        <p className="text-xs text-muted">Follows your device's light/dark setting automatically.</p>
      </div>
    </div>
  );
}
