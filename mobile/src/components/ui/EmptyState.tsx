import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme, radius } from '@/theme';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.badge, { backgroundColor: colors.elevated, borderRadius: radius.xl }]}>
        <Icon size={28} color={colors.muted} />
      </View>
      <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
      {description ? <Text style={[styles.desc, { color: colors.muted }]}>{description}</Text> : null}
      {action ? <View style={{ marginTop: 18 }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 52 },
  badge: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 14, textAlign: 'center', marginTop: 4, maxWidth: 280 },
});
