import { clear, createStore, del, get, keys, set } from 'idb-keyval';
import { RECEIPTS_DB, RECEIPTS_STORE } from '@/constants/storage';
import { uid } from './id';

// Receipt image blobs live in IndexedDB (large capacity), keyed by receiptId.
// Expense records only store the id, keeping localStorage small.
const store = createStore(RECEIPTS_DB, RECEIPTS_STORE);

/** Persist a receipt blob and return its generated id. */
export async function putReceipt(blob: Blob): Promise<string> {
  const id = uid();
  await set(id, blob, store);
  return id;
}

export async function getReceipt(id: string): Promise<Blob | undefined> {
  return get<Blob>(id, store);
}

export async function deleteReceipt(id: string): Promise<void> {
  await del(id, store);
}

/** Remove any receipts not referenced by the given id set (orphan cleanup). */
export async function pruneReceipts(keepIds: Set<string>): Promise<void> {
  const all = (await keys(store)) as string[];
  await Promise.all(all.filter((k) => !keepIds.has(k)).map((k) => del(k, store)));
}

export async function clearReceipts(): Promise<void> {
  await clear(store);
}
