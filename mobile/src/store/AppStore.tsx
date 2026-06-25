import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import { createDebouncedSaver, loadState } from '@/lib/storage';
import { ensureReceiptsDir, pruneReceipts } from '@/lib/receipts';
import type { PersistedData, StorageError } from '@/types';
import type { Action } from './actions';
import { initialState, reducer, type AppState as AppStateModel } from './reducer';

export interface AppStoreValue {
  state: AppStateModel;
  dispatch: React.Dispatch<Action>;
}

export const AppStoreContext = createContext<AppStoreValue | null>(null);

interface AppStoreProviderProps {
  children: ReactNode;
  onStorageError?: (error: StorageError) => void;
}

export function AppStoreProvider({ children, onStorageError }: AppStoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const onErrorRef = useRef(onStorageError);
  onErrorRef.current = onStorageError;

  const saver = useMemo(
    () => createDebouncedSaver((error) => { if (error) onErrorRef.current?.(error); }),
    [],
  );

  // Hydrate once from AsyncStorage; ensure the receipts dir exists.
  useEffect(() => {
    let active = true;
    (async () => {
      await ensureReceiptsDir().catch(() => {});
      const { data, error } = await loadState();
      if (!active) return;
      dispatch({ type: 'hydrate', data });
      if (error) onErrorRef.current?.(error);
    })();
    return () => { active = false; };
  }, []);

  // Persist (debounced) whenever a persisted slice changes, after hydration.
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

  // Flush pending writes when the app leaves the foreground (RN analog of pagehide).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') saver.flush();
    });
    return () => sub.remove();
  }, [saver]);

  // Garbage-collect orphaned receipt files once hydrated.
  useEffect(() => {
    if (!state.hydrated) return;
    const keep = new Set<string>();
    for (const e of state.expenses) if (e.receiptId) keep.add(e.receiptId);
    void pruneReceipts(keep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hydrated]);

  const value = useMemo<AppStoreValue>(() => ({ state, dispatch }), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}
