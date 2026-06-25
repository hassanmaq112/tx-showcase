import { Pressable, StyleSheet, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { Trash2 } from 'lucide-react-native';
import { useReceiptUrl } from '@/hooks/useReceiptUrl';

interface ReceiptLightboxProps {
  visible: boolean;
  receiptId: string | undefined;
  onClose: () => void;
  onDelete?: () => void;
}

/** Native fullscreen zoomable receipt viewer (pinch-zoom + swipe-to-close). */
export function ReceiptLightbox({ visible, receiptId, onClose, onDelete }: ReceiptLightboxProps) {
  const url = useReceiptUrl(receiptId);
  return (
    <ImageView
      images={url ? [{ uri: url }] : []}
      imageIndex={0}
      visible={visible && !!url}
      onRequestClose={onClose}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
      FooterComponent={
        onDelete
          ? () => (
              <View style={styles.footer}>
                <Pressable onPress={onDelete} style={styles.deletePill}>
                  <Trash2 size={18} color="#fff" />
                </Pressable>
              </View>
            )
          : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: { alignItems: 'center', paddingBottom: 48 },
  deletePill: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999 },
});
