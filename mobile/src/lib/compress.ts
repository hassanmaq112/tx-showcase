import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { RECEIPT_MAX_BYTES, RECEIPT_MAX_DIM } from '@/constants/config';

export interface CompressOptions {
  maxBytes?: number;
  maxDim?: number;
}

async function fileSize(uri: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists && !info.isDirectory ? (info.size ?? 0) : 0;
}

/**
 * Downscale (longest edge ≤ maxDim) + JPEG-compress an image to under maxBytes.
 * Returns a file:// uri of the compressed image. Replaces the web canvas flow;
 * the manipulator normalizes EXIF orientation automatically.
 */
export async function compressImage(uri: string, opts: CompressOptions = {}): Promise<string> {
  const maxBytes = opts.maxBytes ?? RECEIPT_MAX_BYTES;
  const maxDim = opts.maxDim ?? RECEIPT_MAX_DIM;

  // Probe original dimensions (no-op manipulate returns width/height).
  const probe = await manipulateAsync(uri, [], { compress: 1, format: SaveFormat.JPEG });
  const resizeAction =
    probe.width >= probe.height
      ? probe.width > maxDim
        ? [{ resize: { width: maxDim } }]
        : []
      : probe.height > maxDim
        ? [{ resize: { height: maxDim } }]
        : [];

  let quality = 0.82;
  let result = await manipulateAsync(uri, resizeAction, {
    compress: quality,
    format: SaveFormat.JPEG,
  });
  while ((await fileSize(result.uri)) > maxBytes && quality > 0.4) {
    quality -= 0.12;
    result = await manipulateAsync(uri, resizeAction, {
      compress: quality,
      format: SaveFormat.JPEG,
    });
  }
  return result.uri;
}
