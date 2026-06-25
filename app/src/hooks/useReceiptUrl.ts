import { useEffect, useState } from 'react';
import { getReceipt } from '@/lib/receipts';

/**
 * Resolve a receiptId to an object URL for display, revoking it on change/unmount
 * to avoid leaking blob URLs. Returns null while loading or when there's no id.
 */
export function useReceiptUrl(receiptId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    if (!receiptId) {
      setUrl(null);
      return;
    }

    getReceipt(receiptId)
      .then((blob) => {
        if (!active || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (active) setUrl(null);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [receiptId]);

  return url;
}
