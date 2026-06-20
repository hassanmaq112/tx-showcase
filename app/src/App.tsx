import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppStoreProvider } from '@/store/AppStore';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from '@/components/ui/Toaster';
import { useToast } from '@/hooks/useToast';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { AddExpenseScreen } from '@/screens/AddExpenseScreen';
import { EditExpenseScreen } from '@/screens/EditExpenseScreen';
import { AnalyticsScreen } from '@/screens/AnalyticsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

export function App() {
  const { show } = useToast();

  return (
    <AppStoreProvider onStorageError={(e) => show(e.message, 'error')}>
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/add" element={<AddExpenseScreen />} />
            <Route path="/edit/:id" element={<EditExpenseScreen />} />
            <Route path="/analytics" element={<AnalyticsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<DashboardScreen />} />
          </Routes>
        </AppShell>
        <BottomNav />
      </HashRouter>
      <Toaster />
    </AppStoreProvider>
  );
}
