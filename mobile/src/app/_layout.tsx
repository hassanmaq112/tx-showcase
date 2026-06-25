import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppStoreProvider } from '@/store/AppStore';
import { Toaster } from '@/components/ui/Toaster';
import { SyncManager } from '@/components/SyncManager';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

/** Redirects between the auth screen and the app based on session state. */
function AuthGate() {
  const { configured, loading, session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    const needsAuth = configured && !session;
    if (needsAuth && !inAuth) router.replace('/(auth)/sign-in');
    else if (!needsAuth && inAuth) router.replace('/');
  }, [configured, loading, session, segments, router]);

  return null;
}

function StoreLayer() {
  const { show } = useToast();
  return (
    <AppStoreProvider onStorageError={(e) => show(e.message, 'error')}>
      <AuthGate />
      <SyncManager />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="add" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit/[id]" options={{ presentation: 'modal' }} />
      </Stack>
      <Toaster />
      <StatusBar style="auto" />
    </AppStoreProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastProvider>
          <AuthProvider>
            <StoreLayer />
          </AuthProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
