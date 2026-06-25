import { useRef, useState } from 'react';
import { Camera, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useReceiptUrl } from '@/hooks/useReceiptUrl';
import { useToast } from '@/hooks/useToast';
import { compressImage } from '@/lib/compress';
import { deleteReceipt, putReceipt } from '@/lib/receipts';

interface ReceiptPickerProps {
  /** Current receipt id (may be a pre-existing one from the edited expense). */
  value: string | undefined;
  onChange: (receiptId: string | undefined) => void;
}

export function ReceiptPicker({ value, onChange }: ReceiptPickerProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  // Tracks blobs created during this editing session so replacing one cleans up.
  const sessionId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { show } = useToast();
  const previewUrl = useReceiptUrl(value);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const blob = await compressImage(file);
      const id = await putReceipt(blob);
      // Clean up a blob we created earlier in this session (not the saved one).
      if (sessionId.current) await deleteReceipt(sessionId.current);
      sessionId.current = id;
      onChange(id);
    } catch {
      show('Could not process that image.', 'error');
    } finally {
      setBusy(false);
      if (cameraRef.current) cameraRef.current.value = '';
      if (galleryRef.current) galleryRef.current.value = '';
    }
  };

  const remove = () => {
    if (sessionId.current) {
      void deleteReceipt(sessionId.current);
      sessionId.current = null;
    }
    onChange(undefined);
  };

  return (
    <div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Receipt preview"
            className="max-h-56 w-full rounded-xl object-cover ring-1 ring-border"
          />
          <button
            type="button"
            onClick={remove}
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white no-tap-highlight"
            aria-label="Remove receipt"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            disabled={busy}
            onClick={() => cameraRef.current?.click()}
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
            Camera
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={busy}
            onClick={() => galleryRef.current?.click()}
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
            Gallery
          </Button>
        </div>
      )}
    </div>
  );
}
