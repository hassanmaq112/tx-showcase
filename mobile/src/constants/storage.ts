// AsyncStorage keys and the persisted schema version (bump when shape changes).

export const STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  version: 'etx.version',
  expenses: 'etx.expenses',
  categories: 'etx.categories',
  budgets: 'etx.budgets',
  settings: 'etx.settings',
} as const;

/** Subdirectory of FileSystem.documentDirectory where receipt JPEGs are cached. */
export const RECEIPTS_DIR = 'receipts';

/** AsyncStorage key for the offline sync outbox (Supabase layer). */
export const OUTBOX_KEY = 'etx.outbox';
