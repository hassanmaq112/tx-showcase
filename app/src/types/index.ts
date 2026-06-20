// Domain types for the expense tracker. Kept dependency-free so any module can import.

export type ID = string;

/** A spending category. Default categories ship with the app; users can add custom ones. */
export interface Category {
  id: ID;
  name: string;
  /** lucide-react icon name key (see constants/categories.ts → CATEGORY_ICONS). */
  icon: string;
  /** Hex color used for chart slices and category pills. */
  color: string;
  /** False for built-in defaults, true for user-added. Controls delete rules. */
  isCustom: boolean;
}

/** A single expense record. Receipt image lives in IndexedDB, referenced by receiptId. */
export interface Expense {
  id: ID;
  /** Local calendar day as 'yyyy-MM-dd' (NOT a UTC timestamp) to keep day grouping stable. */
  date: string;
  categoryId: ID;
  /** Amount in major currency units, rounded to 2dp. */
  amount: number;
  notes?: string;
  /** Key into the IndexedDB receipt store, or undefined when no receipt attached. */
  receiptId?: ID;
  /** Epoch ms — secondary sort within a day and audit trail. */
  createdAt: number;
  updatedAt: number;
}

export interface CategoryBudget {
  categoryId: ID;
  monthlyLimit: number;
}

export interface Budgets {
  /** null = no global budget configured. */
  globalMonthly: number | null;
  perCategory: CategoryBudget[];
}

export interface Settings {
  /** ISO 4217 currency code, e.g. 'USD'. */
  currency: string;
  /** Fraction of a budget at which to warn (default 0.9). */
  warnThreshold: number;
}

export type BudgetLevel = 'none' | 'ok' | 'warn' | 'over';

export interface BudgetStatus {
  spent: number;
  /** null when no limit is set for this scope. */
  limit: number | null;
  /** spent / limit, or 0 when there is no limit. */
  ratio: number;
  remaining: number;
  level: BudgetLevel;
}

/** The full persisted document shape (versioned for migrations). */
export interface PersistedData {
  version: number;
  expenses: Expense[];
  categories: Category[];
  budgets: Budgets;
  settings: Settings;
}

// ---- Analytics ----

export interface CategoryBreakdownItem {
  category: Category;
  total: number;
  /** Percent of the period total (0–100). */
  percent: number;
}

export interface TrendPoint {
  /** 'yyyy-MM' */
  monthKey: string;
  /** Short display label, e.g. 'Mar'. */
  label: string;
  total: number;
}

export interface PeriodTotals {
  month: number;
  week: number;
  dailyAverage: number;
}

export interface MonthOverMonth {
  current: number;
  previous: number;
  /** Percent change vs previous month; null when previous is 0. */
  deltaPct: number | null;
}

// ---- Storage ----

export type StorageErrorKind = 'quota' | 'unavailable' | 'parse';

export interface StorageError {
  kind: StorageErrorKind;
  message: string;
}

// ---- Toast ----

export type ToastVariant = 'success' | 'error' | 'info' | 'warn';

export interface Toast {
  id: ID;
  message: string;
  variant: ToastVariant;
}
