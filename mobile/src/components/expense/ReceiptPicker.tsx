import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useReceiptUrl } from '@/hooks/useReceiptUrl';
import { useToast } from '@/hooks/useToast';
import { compressImage } from '@/lib/compress';
import { deleteReceipt, putReceipt } from '@/lib/receipts';
import { useTheme, radius } from '@/theme';

interface ReceiptPickerProps {
  value: string | undefined;
  onChange: (receiptId: string | undefined) => void;
}

export function ReceiptPicker({ value, onChange }: ReceiptPickerProps) {
  const { colors } = useTheme();
  const { show } = useToast();
  const [busy, setBusy] = useState(false);
  const sessionId = useRef<string | null>(null);
  const previewUrl = useReceiptUrl(value);

  const handleAsset = async (uri: string) => {
    setBusy(true);
    try {
      const compressed = await compressImage(uri);
      const id = await putReceipt(compressed);
      if (sessionId.current) await deleteReceipt(sessionId.current);
      sessionId.current = id;
      onChange(id);
    } catch {
      show('Could not process that image.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const pickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { show('Camera permission denied.', 'error'); return; }
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
    if (!res.canceled && res.assets[0]) await handleAsset(res.assets[0].uri);
  };

  const pickGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (!res.canceled && res.assets[0]) await handleAsset(res.assets[0].uri);
  };

  const remove = () => {
    if (sessionId.current) { void deleteReceipt(sessionId.current); sessionId.current = null; }
    onChange(undefined);
  };

  if (previewUrl) {
    return (
      <View>
        <Image source={{ uri: previewUrl }} style={[styles.preview, { borderColor: colors.border }]} contentFit="cover" />
        <Pressable onPress={remove} style={styles.removeBtn}>
          <Trash2 size={17} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {Platform.OS !== 'web' && (
        <Button title="Camera" variant="secondary" size="lg" loading={busy} onPress={pickCamera}
          icon={<Camera size={18} color={colors.ink} />} style={{ flex: 1 }} />
      )}
      <Button title="Gallery" variant="secondary" size="lg" loading={busy} onPress={pickGallery}
        icon={<ImagePlus size={18} color={colors.ink} />} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  preview: { width: '100%', height: 200, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth },
  removeBtn: {
    position: 'absolute', top: 8, right: 8, width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
  },
});
