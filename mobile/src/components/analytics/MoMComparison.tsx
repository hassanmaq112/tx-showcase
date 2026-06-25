import { StyleSheet, Text, View } from 'react-native';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { formatMoney } from '@/lib/currency';
import { useTheme } from '@/theme';
import type { MonthOverMonth } from '@/types';

export function MoMComparison({ data, currency }: { data: MonthOverMonth; currency: string }) {
  const { colors } = useTheme();
  const { current, previous, deltaPct } = data;
  const up = deltaPct != null && deltaPct > 0;
  const flat = deltaPct == null || deltaPct === 0;
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
  const tone = flat ? colors.muted : up ? colors.danger : colors.success;

  return (
    <Card>
      <View style={styles.row}>
        <View>
          <Text style={[styles.label, { color: colors.muted }]}>VS LAST MONTH</Text>
          <Text style={[styles.value, { color: colors.ink }]}>{formatMoney(current, currency)}</Text>
        </View>
        <View style={styles.delta}>
          <Icon size={18} color={tone} />
          <Text style={[styles.deltaText, { color: tone }]}>
            {deltaPct == null ? '—' : `${up ? '+' : ''}${deltaPct}%`}
          </Text>
        </View>
      </View>
      <Text style={[styles.prev, { color: colors.muted }]}>Last month: {formatMoney(previous, currency)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  value: { fontSize: 18, fontWeight: '700', marginTop: 4, fontVariant: ['tabular-nums'] },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deltaText: { fontSize: 14, fontWeight: '600' },
  prev: { fontSize: 12, marginTop: 4 },
});
