import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Public env (Expo inlines EXPO_PUBLIC_* at build time). The anon key is safe in
// the client — Row Level Security enforces per-user access. NEVER ship the
// service-role key.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** True only when real (non-placeholder) credentials are present. */
export const isSupabaseConfigured =
  /^https?:\/\/.+/.test(url) && anonKey.length > 20 && !anonKey.includes('PLACEHOLDER');

/**
 * The Supabase client, or null when unconfigured. When null the app runs in
 * pure local-first mode (no auth gate, no sync) so it works against placeholders.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // RN has no URL bar; disable URL session detection (web OAuth only).
        detectSessionInUrl: false,
      },
    })
  : null;
