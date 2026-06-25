import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/context/ToastContext';
import { AppStoreProvider } from '@/store/AppStore';
import { Toaster } from '@/components/ui/Toaster';
import { useToast } from '@/hooks/useToast';

function Providers({ children }: { children: React.ReactNode }) {
  // Bridges storage errors from the store into the toast system.
  const { show } = useToast();
  return (
    <AppStoreProvider onStorageError={(e) => show(e.message, 'error')}>
      {children}
      <Toaster />
    </AppStoreProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastProvider>
          <Providers>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="add" options={{ presentation: 'modal' }} />
              <Stack.Screen name="edit/[id]" options={{ presentation: 'modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </Providers>
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
