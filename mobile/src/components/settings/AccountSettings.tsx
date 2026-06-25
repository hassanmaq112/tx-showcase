import { StyleSheet, Text, View } from 'react-native';
import { LogOut, UserCircle2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, radius } from '@/theme';

/** Signed-in account row + sign out. Renders nothing when backend is unconfigured. */
export function AccountSettings() {
  const { configured, user, signOut } = useAuth();
  const { colors } = useTheme();
  if (!configured) return null;

  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl }]}>
        <UserCircle2 size={22} color={colors.muted} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.muted }]}>Signed in as</Text>
          <Text style={[styles.email, { color: colors.ink }]} numberOfLines={1}>{user?.email ?? '—'}</Text>
        </View>
      </View>
      <Button title="Sign out" variant="secondary" icon={<LogOut size={18} color={colors.ink} />} onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: StyleSheet.hairlineWidth, padding: 14 },
  label: { fontSize: 12 },
  email: { fontSize: 15, fontWeight: '500', marginTop: 1 },
});
