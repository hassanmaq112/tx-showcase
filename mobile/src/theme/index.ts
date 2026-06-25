import { useColorScheme } from 'react-native';
import type { BudgetLevel } from '@/types';

// Design tokens mirror the web app's CSS variables (app/src/index.css), as concrete
// values so RN StyleSheet / chart libs / icon color props can consume them directly.

export interface Palette {
  canvas: string;
  surface: string;
  elevated: string;
  border: string;
  ink: string;
  muted: string;
  brand: string;
  brandInk: string;
  // semantic
  success: string;
  warn: string;
  danger: string;
  overlay: string;
}

export const light: Palette = {
  canvas: '#f8fafc',
  surface: '#ffffff',
  elevated: '#ffffff',
  border: '#e2e8f0',
  ink: '#0f172a',
  muted: '#64748b',
  brand: '#4f46e5',
  brandInk: '#ffffff',
  success: '#10b981',
  warn: '#f59e0b',
  danger: '#ef4444',
  overlay: 'rgba(0,0,0,0.5)',
};

export const dark: Palette = {
  canvas: '#020617',
  surface: '#0f172a',
  elevated: '#1e293b',
  border: '#334155',
  ink: '#f1f5f9',
  muted: '#94a3b8',
  brand: '#818cf8',
  brandInk: '#0f172a',
  success: '#34d399',
  warn: '#fbbf24',
  danger: '#f87171',
  overlay: 'rgba(0,0,0,0.6)',
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 } as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  display: 28,
} as const;

export interface Theme {
  mode: 'light' | 'dark';
  colors: Palette;
}

/** Active theme, following the system color scheme. */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  return { mode, colors: mode === 'dark' ? dark : light };
}

/** Color for a budget level, given the active palette. */
export function levelColor(level: BudgetLevel, colors: Palette): string {
  switch (level) {
    case 'ok':
      return colors.success;
    case 'warn':
      return colors.warn;
    case 'over':
      return colors.danger;
    default:
      return colors.brand;
  }
}

/** Translucent tint of a hex color (e.g. category color at low alpha for chips). */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}
