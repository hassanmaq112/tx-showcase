import type { Category } from '@/types';

/**
 * lucide-react icon names allowed for categories. The keys are stored on the
 * Category record; CategoryIcon resolves them to components at render time.
 */
export const CATEGORY_ICONS = [
  'Utensils',
  'Car',
  'Clapperboard',
  'ShoppingBag',
  'ReceiptText',
  'HeartPulse',
  'Plane',
  'Home',
  'Dog',
  'Gift',
  'GraduationCap',
  'Dumbbell',
  'Coffee',
  'Smartphone',
  'Wrench',
  'PiggyBank',
  'CircleDashed',
] as const;

export type CategoryIconName = (typeof CATEGORY_ICONS)[number];

/** A pleasant, high-contrast palette for category pills and charts. */
export const CATEGORY_COLORS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#ef4444', // red
  '#eab308', // amber
  '#22c55e', // green
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#84cc16', // lime
] as const;

/** Stable id of the protected fallback category that orphaned expenses reassign to. */
export const OTHER_CATEGORY_ID = 'cat-other';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Food', icon: 'Utensils', color: '#f97316', isCustom: false },
  { id: 'cat-transport', name: 'Transport', icon: 'Car', color: '#3b82f6', isCustom: false },
  {
    id: 'cat-entertainment',
    name: 'Entertainment',
    icon: 'Clapperboard',
    color: '#a855f7',
    isCustom: false,
  },
  { id: 'cat-shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', isCustom: false },
  { id: 'cat-bills', name: 'Bills', icon: 'ReceiptText', color: '#14b8a6', isCustom: false },
  { id: 'cat-health', name: 'Health', icon: 'HeartPulse', color: '#ef4444', isCustom: false },
  {
    id: OTHER_CATEGORY_ID,
    name: 'Other',
    icon: 'CircleDashed',
    color: '#64748b',
    isCustom: false,
  },
];
