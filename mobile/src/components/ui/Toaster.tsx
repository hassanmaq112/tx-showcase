import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react-native';
import { useToast } from '@/hooks/useToast';
import { useTheme, radius } from '@/theme';
import type { ToastVariant } from '@/types';

const ICONS = { success: CheckCircle2, error: XCircle, warn: AlertTriangle, info: Info } as const;

export function Toaster() {
  const { toasts, dismiss } = useToast();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  if (toasts.length === 0) return null;

  const accent: Record<ToastVariant, string> = {
    success: colors.success, error: colors.danger, warn: colors.warn, info: colors.brand,
  };

  return (
    <View pointerEvents="box-none" style={[styles.root, { top: insets.top + 8 }]}>
      {toasts.map((t) => {
        const Icon = ICONS[t.variant];
        return (
          <View
            key={t.id}
            style={[styles.toast, { backgroundColor: colors.elevated, borderColor: colors.border, borderRadius: radius.lg }]}
          >
            <Icon size={20} color={accent[t.variant]} />
            <Text style={[styles.msg, { color: colors.ink }]} numberOfLines={2}>{t.message}</Text>
            <Pressable onPress={() => dismiss(t.id)} hitSlop={8}>
              <X size={15} color={colors.muted} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', left: 0, right: 0, alignItems: 'center', gap: 8, paddingHorizontal: 16, zIndex: 100 },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', maxWidth: 420,
    paddingHorizontal: 14, paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth,
  },
  msg: { flex: 1, fontSize: 14 },
});
