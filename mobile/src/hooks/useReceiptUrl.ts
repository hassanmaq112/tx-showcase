import { useEffect, useState } from 'react';
import { getReceiptUri } from '@/lib/receipts';
import { supabase } from '@/lib/supabase';
import { ensureLocalReceipt } from '@/lib/receiptsRemote';

/**
 * Resolve a receiptId to a local file uri for <Image>. If it's not cached
 * locally and Supabase is configured, lazily download it from Storage.
 * Returns null while loading or when there's no receipt.
 */
export function useReceiptUrl(receiptId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!receiptId) {
      setUrl(null);
      return;
    }
    (async () => {
      let uri = await getReceiptUri(receiptId).catch(() => undefined);
      if (!uri && supabase) {
        const { data } = await supabase.auth.getUser();
        if (data.user) uri = await ensureLocalReceipt(data.user.id, receiptId).catch(() => undefined);
      }
      if (active) setUrl(uri ?? null);
    })();
    return () => { active = false; };
  }, [receiptId]);

  return url;
}
