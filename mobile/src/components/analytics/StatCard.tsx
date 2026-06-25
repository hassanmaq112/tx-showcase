import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme, radius } from '@/theme';

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}>
      <View style={styles.labelRow}>
        {icon}
        <Text style={[styles.label, { color: colors.muted }]} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: colors.ink }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderWidth: StyleSheet.hairlineWidth, padding: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  value: { fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
