import { StyleSheet, Text, View } from 'react-native';
import { MoonStar } from 'lucide-react-native';
import { useTheme, radius } from '@/theme';

export function ThemeNote() {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl }]}>
      <MoonStar size={18} color={colors.muted} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.ink }]}>Appearance</Text>
        <Text style={[styles.sub, { color: colors.muted }]}>Follows your device's light/dark setting.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: StyleSheet.hairlineWidth, padding: 14 },
  title: { fontSize: 14, fontWeight: '500' },
  sub: { fontSize: 12, marginTop: 1 },
});
