import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BarChart3, Home, Plus, Settings } from 'lucide-react-native';
import { useTheme } from '@/theme';

const ICONS: Record<string, typeof Home> = { index: Home, analytics: BarChart3, settings: Settings };
const LABELS: Record<string, string> = { index: 'Home', analytics: 'Stats', settings: 'Settings' };

interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
}

/** Custom tab bar: Home / Stats / Settings with a raised center Add button. */
export function TabBar({ state, navigation }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const routes = state.routes.filter((r) => ICONS[r.name]);

  const renderTab = (routeName: string) => {
    const routeIndex = state.routes.findIndex((r) => r.name === routeName);
    const isActive = state.index === routeIndex;
    const Icon = ICONS[routeName];
    const color = isActive ? colors.brand : colors.muted;
    return (
      <Pressable
        key={routeName}
        style={styles.tab}
        onPress={() => navigation.navigate(routeName)}
      >
        <Icon size={22} color={color} strokeWidth={isActive ? 2.4 : 2} />
        <Text style={[styles.label, { color }]}>{LABELS[routeName]}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { backgroundColor: colors.canvas, borderTopColor: colors.border, paddingBottom: insets.bottom || 8 }]}>
      {renderTab('index')}
      {renderTab('analytics')}
      <View style={styles.fabSlot}>
        <Pressable
          onPress={() => router.push('/add')}
          style={[styles.fab, { backgroundColor: colors.brand }]}
          accessibilityLabel="Add expense"
          testID="fab-add"
        >
          <Plus size={26} color={colors.brandInk} strokeWidth={2.6} />
        </Pressable>
      </View>
      {renderTab('settings')}
      <View style={styles.tab} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'flex-start', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 11, fontWeight: '500' },
  fabSlot: { flex: 1, alignItems: 'center' },
  fab: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: -24,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
});
