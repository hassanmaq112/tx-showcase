import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CategoryBadge } from '@/components/expense/CategoryPill';
import { formatMoney } from '@/lib/currency';
import { useTheme } from '@/theme';
import type { BudgetStatus, Category } from '@/types';

export function CategoryBudgetRow({ category, status, currency }: { category: Category; status: BudgetStatus; currency: string }) {
  const { colors } = useTheme();
  if (status.limit == null) return null;
  const over = status.level === 'over';
  return (
    <View style={styles.row}>
      <CategoryBadge category={category} size={36} />
      <View style={{ flex: 1 }}>
        <View style={styles.head}>
          <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>{category.name}</Text>
          <Text style={[styles.amt, { color: over ? colors.danger : colors.muted }]}>
            {formatMoney(status.spent, currency)} / {formatMoney(status.limit, currency)}
          </Text>
        </View>
        <ProgressBar ratio={status.ratio} level={status.level} height={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontSize: 14, fontWeight: '500', flex: 1, marginRight: 8 },
  amt: { fontSize: 12, fontVariant: ['tabular-nums'] },
});
