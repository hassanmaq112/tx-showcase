import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';
import { ensureReceiptsDir, receiptUri } from './receipts';

const BUCKET = 'receipts';
const objectPath = (userId: string, id: string) => `${userId}/${id}.jpg`;

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
/** Decode base64 → Uint8Array (no Buffer/atob dependency in Hermes). */
function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, '');
  const len = Math.floor((clean.length * 3) / 4);
  const out = new Uint8Array(len);
  let p = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const a = B64.indexOf(clean[i]);
    const b = B64.indexOf(clean[i + 1]);
    const c = B64.indexOf(clean[i + 2]);
    const d = B64.indexOf(clean[i + 3]);
    out[p++] = (a << 2) | (b >> 4);
    if (c !== -1 && i + 2 < clean.length) out[p++] = ((b & 15) << 4) | (c >> 2);
    if (d !== -1 && i + 3 < clean.length) out[p++] = ((c & 3) << 6) | d;
  }
  return out.subarray(0, p);
}

/** Upload a locally-cached receipt to the user's private Storage folder. */
export async function uploadReceipt(userId: string, id: string): Promise<void> {
  if (!supabase) return;
  const uri = receiptUri(id);
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) return;
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  await supabase.storage.from(BUCKET).upload(objectPath(userId, id), base64ToBytes(b64), {
    contentType: 'image/jpeg',
    upsert: true,
  });
}

export async function removeRemoteReceipt(userId: string, id: string): Promise<void> {
  if (!supabase) return;
  await supabase.storage.from(BUCKET).remove([objectPath(userId, id)]);
}

/** Download a receipt from Storage into the local cache if it isn't there yet. */
export async function ensureLocalReceipt(userId: string, id: string): Promise<string | undefined> {
  if (!supabase) return undefined;
  await ensureReceiptsDir();
  const dest = receiptUri(id);
  const existing = await FileSystem.getInfoAsync(dest);
  if (existing.exists) return dest;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(objectPath(userId, id), 3600);
  if (!data?.signedUrl) return undefined;
  const res = await FileSystem.downloadAsync(data.signedUrl, dest);
  return res.status === 200 ? dest : undefined;
}
