import { RECEIPT_MAX_BYTES, RECEIPT_MAX_DIM } from '@/constants/config';

export interface CompressOptions {
  maxBytes?: number;
  maxDim?: number;
  mime?: string;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
}

/**
 * Downscale + compress an image File to a JPEG Blob under `maxBytes`.
 * Uses createImageBitmap with EXIF orientation correction so phone photos
 * aren't sideways. Iteratively lowers quality until the size target is met.
 */
export async function compressImage(file: File, opts: CompressOptions = {}): Promise<Blob> {
  const maxBytes = opts.maxBytes ?? RECEIPT_MAX_BYTES;
  const maxDim = opts.maxDim ?? RECEIPT_MAX_DIM;
  const mime = opts.mime ?? 'image/jpeg';

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Older Safari may not support the options bag; retry without it.
    bitmap = await createImageBitmap(file);
  }

  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Canvas not supported');
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.82;
  let blob = await canvasToBlob(canvas, mime, quality);
  while (blob && blob.size > maxBytes && quality > 0.4) {
    quality -= 0.12;
    blob = await canvasToBlob(canvas, mime, quality);
  }
  if (!blob) throw new Error('Image compression failed');
  return blob;
}
