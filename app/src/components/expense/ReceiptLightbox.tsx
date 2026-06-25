import { useRef, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useReceiptUrl } from '@/hooks/useReceiptUrl';

interface ReceiptLightboxProps {
  open: boolean;
  receiptId: string | undefined;
  onClose: () => void;
  onDelete?: () => void;
}

/** Full-screen receipt viewer with double-tap zoom and optional delete. */
export function ReceiptLightbox({ open, receiptId, onClose, onDelete }: ReceiptLightboxProps) {
  const url = useReceiptUrl(receiptId);
  const [zoomed, setZoomed] = useState(false);
  const lastTap = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) setZoomed((z) => !z);
    lastTap.current = now;
  };

  return (
    <Modal open={open} onClose={onClose} variant="full" hideClose className="bg-black">
      <div className="flex items-center justify-between px-4 pt-safe">
        <div className="py-3">
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white no-tap-highlight"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-red-400 no-tap-highlight"
            aria-label="Delete receipt"
          >
            <Trash2 size={19} />
          </button>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto p-4" onClick={handleTap}>
        {url ? (
          <img
            src={url}
            alt="Receipt"
            className="max-h-full max-w-full select-none rounded-lg object-contain transition-transform duration-300"
            style={{ transform: zoomed ? 'scale(2)' : 'scale(1)' }}
          />
        ) : (
          <p className="text-white/60">Loading…</p>
        )}
      </div>
      <p className="pb-safe pb-4 text-center text-xs text-white/40">Double-tap to zoom</p>
    </Modal>
  );
}
