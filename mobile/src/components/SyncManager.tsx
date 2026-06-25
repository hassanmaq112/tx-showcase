import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/hooks/useAppStore';
import { mergeRemote, pullRemote, pushReconcile, subscribeRealtime } from '@/lib/sync';
import type { PersistedData } from '@/types';
import type { AppState as StoreState } from '@/store/reducer';

function snapshot(s: StoreState): PersistedData {
  return { version: s.version, expenses: s.expenses, categories: s.categories, budgets: s.budgets, settings: s.settings };
}

/**
 * Headless: keeps the local store synced with Supabase (pull+merge on login,
 * debounced reconcile-push on local edits, drain on reconnect, realtime).
 * Inert when Supabase is unconfigured or no user is signed in.
 */
export function SyncManager() {
  const { configured, user } = useAuth();
  const { state, dispatch } = useAppStore();
  const userId = user?.id;

  const synced = useRef(false);
  const lastSynced = useRef<string>(''); // JSON of the last doc we pulled/pushed (echo guard)
  const stateRef = useRef(state);
  stateRef.current = state;
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial pull + merge on sign-in.
  useEffect(() => {
    synced.current = false;
    if (!configured || !userId || !state.hydrated) return;
    let cancelled = false;
    (async () => {
      const local = snapshot(stateRef.current);
      const remote = await pullRemote(userId).catch(() => null);
      if (cancelled) return;
      const merged = remote ? mergeRemote(local, remote) : local;
      if (remote) dispatch({ type: 'data/import', data: merged });
      lastSynced.current = JSON.stringify(merged);
      await pushReconcile(userId, merged).catch(() => {});
      synced.current = true;
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, userId, state.hydrated]);

  // Debounced reconcile-push when the local document changes (user edits).
  useEffect(() => {
    if (!configured || !userId || !synced.current) return;
    const json = JSON.stringify(snapshot(state));
    if (json === lastSynced.current) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      lastSynced.current = json;
      void pushReconcile(userId, snapshot(stateRef.current)).catch(() => {});
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.expenses, state.categories, state.budgets, state.settings]);

  // Realtime + reconnect.
  useEffect(() => {
    if (!configured || !userId) return;
    const refresh = async () => {
      const remote = await pullRemote(userId).catch(() => null);
      if (!remote) return;
      const merged = mergeRemote(snapshot(stateRef.current), remote);
      lastSynced.current = JSON.stringify(merged);
      dispatch({ type: 'data/import', data: merged });
    };
    const unsub = subscribeRealtime(userId, refresh);
    const net = NetInfo.addEventListener((s) => {
      if (s.isConnected && synced.current) void pushReconcile(userId, snapshot(stateRef.current)).catch(() => {});
    });
    return () => { unsub(); net(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, userId]);

  return null;
}
