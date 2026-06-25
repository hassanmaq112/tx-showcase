import { useEffect, useState } from 'react';
import { getReceiptUri } from '@/lib/receipts';

/**
 * Resolve a receiptId to a local file uri for <Image>. Returns null while loading
 * or when there's no receipt. (No objectURL lifecycle needed on native — the file
 * uri is stable.)
 */
export function useReceiptUrl(receiptId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!receiptId) {
      setUrl(null);
      return;
    }
    getReceiptUri(receiptId)
      .then((uri) => { if (active) setUrl(uri ?? null); })
      .catch(() => { if (active) setUrl(null); });
    return () => { active = false; };
  }, [receiptId]);

  return url;
}
