import * as FileSystem from 'expo-file-system/legacy';
import { RECEIPTS_DIR } from '@/constants/storage';
import { uid } from './id';

// Receipt JPEGs are cached as files under documentDirectory/receipts/<id>.jpg.
// The expense record stores only the receiptId; the path is derived. (On web,
// documentDirectory is null — these functions degrade to no-ops so the UI, which
// guards receipt capture behind Platform.OS, never crashes.)

const baseDir = FileSystem.documentDirectory ? FileSystem.documentDirectory + RECEIPTS_DIR + '/' : null;

/** Absolute file uri for a receipt id (pure; does not check existence). */
export function receiptUri(id: string): string {
  return (baseDir ?? '') + id + '.jpg';
}

/** Ensure the receipts directory exists. Safe to call repeatedly. */
export async function ensureReceiptsDir(): Promise<void> {
  if (!baseDir) return;
  const info = await FileSystem.getInfoAsync(baseDir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
  }
}

/** Move a compressed image file into the receipts store; returns the new id. */
export async function putReceipt(srcUri: string): Promise<string> {
  if (!baseDir) throw new Error('File storage unavailable');
  await ensureReceiptsDir();
  const id = uid();
  await FileSystem.moveAsync({ from: srcUri, to: receiptUri(id) });
  return id;
}

/** Resolve a receipt id to a local file uri if the file exists, else undefined. */
export async function getReceiptUri(id: string): Promise<string | undefined> {
  if (!baseDir) return undefined;
  const uri = receiptUri(id);
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists ? uri : undefined;
}

export async function deleteReceipt(id: string): Promise<void> {
  if (!baseDir) return;
  await FileSystem.deleteAsync(receiptUri(id), { idempotent: true });
}

/** Delete any receipt files whose id is not in keepIds (orphan cleanup). */
export async function pruneReceipts(keepIds: Set<string>): Promise<void> {
  if (!baseDir) return;
  const info = await FileSystem.getInfoAsync(baseDir);
  if (!info.exists) return;
  const files = await FileSystem.readDirectoryAsync(baseDir);
  await Promise.all(
    files
      .filter((f) => f.endsWith('.jpg') && !keepIds.has(f.replace(/\.jpg$/, '')))
      .map((f) => FileSystem.deleteAsync(baseDir + f, { idempotent: true })),
  );
}

export async function clearReceipts(): Promise<void> {
  if (!baseDir) return;
  await FileSystem.deleteAsync(baseDir, { idempotent: true });
  await ensureReceiptsDir();
}
