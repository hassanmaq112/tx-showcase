import { StyleSheet, Text, View } from 'react-native';
import { CategoryBadge } from '@/components/expense/CategoryPill';
import { formatMoney } from '@/lib/currency';
import { useTheme } from '@/theme';
import type { CategoryBreakdownItem } from '@/types';

export function TopCategories({ data, currency }: { data: CategoryBreakdownItem[]; currency: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      {data.map((item) => (
        <View key={item.category.id} style={styles.row}>
          <CategoryBadge category={item.category} size={36} />
          <View style={{ flex: 1 }}>
            <View style={styles.head}>
              <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>{item.category.name}</Text>
              <Text style={[styles.amt, { color: colors.muted }]}>
                {formatMoney(item.total, currency)} · {item.percent}%
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <View style={{ height: '100%', borderRadius: 4, width: `${item.percent}%`, backgroundColor: item.category.color }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  name: { fontSize: 14, fontWeight: '500', flex: 1, marginRight: 8 },
  amt: { fontSize: 12, fontVariant: ['tabular-nums'] },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
});
