import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Trash2, X } from 'lucide-react-native';
import { Modal } from '@/components/ui/Modal';
import { useReceiptUrl } from '@/hooks/useReceiptUrl';

interface ReceiptLightboxProps {
  visible: boolean;
  receiptId: string | undefined;
  onClose: () => void;
  onDelete?: () => void;
}

/** Web fallback: a plain image in a fullscreen Modal (no native gesture lib). */
export function ReceiptLightbox({ visible, receiptId, onClose, onDelete }: ReceiptLightboxProps) {
  const url = useReceiptUrl(receiptId);
  return (
    <Modal visible={visible} onClose={onClose} variant="full" hideClose>
      <View style={styles.root}>
        <Pressable onPress={onClose} style={styles.btn}><X size={20} color="#fff" /></Pressable>
        {onDelete && (
          <Pressable onPress={onDelete} style={[styles.btn, styles.delete]}><Trash2 size={19} color="#f87171" /></Pressable>
        )}
        {url ? <Image source={{ uri: url }} style={styles.img} contentFit="contain" /> : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  btn: { position: 'absolute', top: 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  delete: { left: undefined, right: 16 },
  img: { width: '90%', height: '80%' },
});
