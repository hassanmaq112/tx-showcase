// localStorage keys and the persisted schema version (bump when shape changes).

export const STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  version: 'etx.version',
  expenses: 'etx.expenses',
  categories: 'etx.categories',
  budgets: 'etx.budgets',
  settings: 'etx.settings',
} as const;

/** IndexedDB store name for receipt blobs (idb-keyval custom store). */
export const RECEIPTS_DB = 'etx-receipts';
export const RECEIPTS_STORE = 'receipts';
