import { useContext } from 'react';
import { AppStoreContext } from '@/store/AppStore';

/** Access the app store. Throws if used outside <AppStoreProvider>. */
export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within an AppStoreProvider');
  return ctx;
}
