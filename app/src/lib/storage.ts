import {
  DEFAULT_CURRENCY,
  DEFAULT_WARN_THRESHOLD,
  SAVE_DEBOUNCE_MS,
} from '@/constants/config';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants/storage';
import type { Budgets, PersistedData, Settings, StorageError } from '@/types';

/** Default document for a fresh install. */
export function defaultData(): PersistedData {
  return {
    version: STORAGE_VERSION,
    expenses: [],
    categories: DEFAULT_CATEGORIES,
    budgets: { globalMonthly: null, perCategory: [] },
    settings: { currency: DEFAULT_CURRENCY, warnThreshold: DEFAULT_WARN_THRESHOLD },
  };
}

function isQuotaError(err: unknown): boolean {
  if (!(err instanceof DOMException)) return false;
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014
  );
}

function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export interface LoadResult {
  data: PersistedData;
  error: StorageError | null;
}

/** Migrate a raw persisted document forward to the current version. */
function migrate(data: PersistedData): PersistedData {
  // v1 is the initial version; future migrations branch on data.version here.
  return { ...data, version: STORAGE_VERSION };
}

/** Load the persisted document from localStorage, falling back to defaults. */
export function loadState(): LoadResult {
  if (typeof localStorage === 'undefined') {
    return { data: defaultData(), error: { kind: 'unavailable', message: 'Storage unavailable.' } };
  }
  const base = defaultData();
  try {
    const data: PersistedData = {
      version: readKey(STORAGE_KEYS.version, STORAGE_VERSION),
      expenses: readKey(STORAGE_KEYS.expenses, base.expenses),
      categories: readKey(STORAGE_KEYS.categories, base.categories),
      budgets: readKey<Budgets>(STORAGE_KEYS.budgets, base.budgets),
      settings: readKey<Settings>(STORAGE_KEYS.settings, base.settings),
    };
    return { data: migrate(data), error: null };
  } catch (err) {
    return {
      data: base,
      error: { kind: 'parse', message: 'Could not read saved data; starting fresh.' },
    };
  }
}

/**
 * Write the document to localStorage as separate slices, so a large `expenses`
 * write failing on quota does not corrupt budgets/settings. Returns the first
 * error encountered, or null on success.
 */
export function writeState(data: PersistedData): StorageError | null {
  const slices: Array<[string, unknown]> = [
    [STORAGE_KEYS.version, STORAGE_VERSION],
    [STORAGE_KEYS.categories, data.categories],
    [STORAGE_KEYS.budgets, data.budgets],
    [STORAGE_KEYS.settings, data.settings],
    // expenses last: it's the largest and most likely to hit quota.
    [STORAGE_KEYS.expenses, data.expenses],
  ];
  for (const [key, value] of slices) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (isQuotaError(err)) {
        return { kind: 'quota', message: 'Storage is full. Export or delete data to free space.' };
      }
      return { kind: 'unavailable', message: 'Could not save changes.' };
    }
  }
  return null;
}

export function clearState(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Create a debounced saver. `save` schedules a write; `flush` forces a pending
 * write immediately (call on pagehide/visibilitychange so the last edit sticks).
 */
export function createDebouncedSaver(
  onError: (error: StorageError | null) => void,
  delay = SAVE_DEBOUNCE_MS,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: PersistedData | null = null;

  const commit = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (pending) {
      const error = writeState(pending);
      pending = null;
      onError(error);
    }
  };

  return {
    save(data: PersistedData) {
      pending = data;
      if (timer) clearTimeout(timer);
      timer = setTimeout(commit, delay);
    },
    flush: commit,
  };
}
