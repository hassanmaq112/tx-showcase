import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_CURRENCY,
  DEFAULT_WARN_THRESHOLD,
  SAVE_DEBOUNCE_MS,
} from '@/constants/config';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants/storage';
import type { PersistedData, StorageError } from '@/types';

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

export interface LoadResult {
  data: PersistedData;
  error: StorageError | null;
}

function migrate(data: PersistedData): PersistedData {
  // v1 is the initial version; future migrations branch on data.version here.
  return { ...data, version: STORAGE_VERSION };
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Load the persisted document from AsyncStorage, falling back to defaults. */
export async function loadState(): Promise<LoadResult> {
  const base = defaultData();
  try {
    const keys = [
      STORAGE_KEYS.version,
      STORAGE_KEYS.expenses,
      STORAGE_KEYS.categories,
      STORAGE_KEYS.budgets,
      STORAGE_KEYS.settings,
    ];
    const entries = await AsyncStorage.multiGet(keys);
    const map = new Map(entries);
    const data: PersistedData = {
      version: parse(map.get(STORAGE_KEYS.version) ?? null, STORAGE_VERSION),
      expenses: parse(map.get(STORAGE_KEYS.expenses) ?? null, base.expenses),
      categories: parse(map.get(STORAGE_KEYS.categories) ?? null, base.categories),
      budgets: parse(map.get(STORAGE_KEYS.budgets) ?? null, base.budgets),
      settings: parse(map.get(STORAGE_KEYS.settings) ?? null, base.settings),
    };
    return { data: migrate(data), error: null };
  } catch {
    return {
      data: base,
      error: { kind: 'parse', message: 'Could not read saved data; starting fresh.' },
    };
  }
}

/**
 * Write the document as separate slices (expenses last — largest). Returns the
 * first error encountered, or null on success.
 */
export async function writeState(data: PersistedData): Promise<StorageError | null> {
  const pairs: [string, string][] = [
    [STORAGE_KEYS.version, JSON.stringify(STORAGE_VERSION)],
    [STORAGE_KEYS.categories, JSON.stringify(data.categories)],
    [STORAGE_KEYS.budgets, JSON.stringify(data.budgets)],
    [STORAGE_KEYS.settings, JSON.stringify(data.settings)],
    [STORAGE_KEYS.expenses, JSON.stringify(data.expenses)],
  ];
  try {
    await AsyncStorage.multiSet(pairs);
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (/quota|full|SQLITE_FULL|database or disk is full/i.test(message)) {
      return { kind: 'quota', message: 'Storage is full. Export or delete data to free space.' };
    }
    return { kind: 'unavailable', message: 'Could not save changes.' };
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch {
    /* ignore */
  }
}

/**
 * Debounced saver. `save` schedules a write; `flush` commits any pending write
 * immediately (call when the app backgrounds so the last edit isn't lost).
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
      const data = pending;
      pending = null;
      void writeState(data).then(onError);
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
