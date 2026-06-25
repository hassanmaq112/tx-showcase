import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  action?: ReactNode;
}

export function ScreenHeader({ title, subtitle, leading, action }: ScreenHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 6, backgroundColor: colors.canvas, borderBottomColor: colors.border }]}>
      <View style={styles.row}>
        {leading}
        <View style={styles.titles}>
          <Text style={[styles.title, { color: colors.ink }]} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  titles: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { fontSize: 14, marginTop: 1 },
});
