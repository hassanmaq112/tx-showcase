import type { ReactNode } from 'react';
import { Modal as RNModal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTheme, radius } from '@/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  variant?: 'sheet' | 'full';
  hideClose?: boolean;
}

export function Modal({ visible, onClose, children, title, variant = 'sheet', hideClose }: ModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (variant === 'full') {
    return (
      <RNModal visible={visible} onRequestClose={onClose} animationType="fade" transparent={false}>
        <View style={{ flex: 1, backgroundColor: colors.canvas }}>{children}</View>
      </RNModal>
    );
  }

  return (
    <RNModal visible={visible} onRequestClose={onClose} animationType="slide" transparent>
      <View style={styles.overlayRoot}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.canvas,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.header}>
            {title ? <Text style={[styles.title, { color: colors.ink }]}>{title}</Text> : <View />}
            {!hideClose && (
              <Pressable onPress={onClose} style={[styles.close, { backgroundColor: colors.elevated }]} hitSlop={8}>
                <X size={18} color={colors.muted} />
              </Pressable>
            )}
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.body}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlayRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: { maxHeight: '90%', paddingHorizontal: 16 },
  handleWrap: { alignItems: 'center', paddingTop: 8 },
  handle: { width: 40, height: 5, borderRadius: 3 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  title: { fontSize: 16, fontWeight: '700' },
  close: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  body: { flexGrow: 0 },
});
