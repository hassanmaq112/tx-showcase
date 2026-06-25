import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { createDebouncedSaver, loadState } from '@/lib/storage';
import { pruneReceipts } from '@/lib/receipts';
import type { PersistedData, StorageError } from '@/types';
import type { Action } from './actions';
import { initialState, reducer, type AppState } from './reducer';

export interface AppStoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const AppStoreContext = createContext<AppStoreValue | null>(null);

interface AppStoreProviderProps {
  children: ReactNode;
  /** Surfaced when a localStorage write fails (e.g. quota full). */
  onStorageError?: (error: StorageError) => void;
}

export function AppStoreProvider({ children, onStorageError }: AppStoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Stable ref so the saver's onError can reach the latest callback.
  const onErrorRef = useRef(onStorageError);
  onErrorRef.current = onStorageError;

  const saver = useMemo(
    () =>
      createDebouncedSaver((error) => {
        if (error) onErrorRef.current?.(error);
      }),
    [],
  );

  // Hydrate once on mount from localStorage.
  useEffect(() => {
    const { data, error } = loadState();
    dispatch({ type: 'hydrate', data });
    if (error) onErrorRef.current?.(error);
  }, []);

  // Persist (debounced) whenever the persisted slices change, after hydration.
  useEffect(() => {
    if (!state.hydrated) return;
    const data: PersistedData = {
      version: state.version,
      expenses: state.expenses,
      categories: state.categories,
      budgets: state.budgets,
      settings: state.settings,
    };
    saver.save(data);
  }, [
    state.hydrated,
    state.version,
    state.expenses,
    state.categories,
    state.budgets,
    state.settings,
    saver,
  ]);

  // Flush pending writes when the page is backgrounded/closed (mobile-safe).
  useEffect(() => {
    const flush = () => saver.flush();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') saver.flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [saver]);

  // Garbage-collect orphaned receipt blobs once hydrated.
  useEffect(() => {
    if (!state.hydrated) return;
    const keep = new Set<string>();
    for (const e of state.expenses) if (e.receiptId) keep.add(e.receiptId);
    void pruneReceipts(keep);
    // Only run on hydration; deletions handle their own blob cleanup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hydrated]);

  const value = useMemo<AppStoreValue>(() => ({ state, dispatch }), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}
