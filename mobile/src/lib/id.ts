import * as Crypto from 'expo-crypto';

/** Generate a unique id. Hermes lacks crypto.randomUUID, so use expo-crypto. */
export function uid(): string {
  try {
    return Crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
