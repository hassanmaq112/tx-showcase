import { StyleSheet, Text, View } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTheme } from '@/theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', destructive, onConfirm, onCancel,
}: ConfirmDialogProps) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} onClose={onCancel} title={title} hideClose>
      <Text style={[styles.msg, { color: colors.muted }]}>{message}</Text>
      <View style={styles.row}>
        <Button title={cancelLabel} variant="secondary" fullWidth onPress={onCancel} style={{ flex: 1 }} />
        <Button
          title={confirmLabel}
          variant={destructive ? 'danger' : 'primary'}
          fullWidth
          onPress={onConfirm}
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  msg: { fontSize: 14, marginTop: 4, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
