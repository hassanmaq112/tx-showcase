// Tunable app constants.

/** Debounce window for persisting state to localStorage. */
export const SAVE_DEBOUNCE_MS = 500;

/** Default fraction of a budget at which the UI warns (amber). */
export const DEFAULT_WARN_THRESHOLD = 0.9;

/** Default currency for new installs. */
export const DEFAULT_CURRENCY = 'USD';

/** Target max size for a stored receipt image, in bytes (~200KB). */
export const RECEIPT_MAX_BYTES = 200_000;

/** Longest-edge dimension a receipt is downscaled to before compression. */
export const RECEIPT_MAX_DIM = 1280;

/** How many recent expenses the dashboard shows. */
export const DASHBOARD_RECENT_LIMIT = 8;

/** Toast auto-dismiss duration. */
export const TOAST_DURATION_MS = 3200;
