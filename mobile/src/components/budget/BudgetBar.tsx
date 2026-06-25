import { StyleSheet, Text, View } from 'react-native';
import { AlertTriangle, Wallet } from 'lucide-react-native';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatMoney } from '@/lib/currency';
import { useTheme, radius } from '@/theme';
import type { BudgetStatus } from '@/types';

export function BudgetBar({ status, currency }: { status: BudgetStatus; currency: string }) {
  const { colors } = useTheme();
  if (status.limit == null) return null;
  const over = status.level === 'over';
  const warn = status.level === 'warn';
  const borderColor = over ? colors.danger : warn ? colors.warn : colors.border;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor, borderRadius: radius.xl }]}>
      <View style={styles.headerRow}>
        <View style={styles.label}>
          <Wallet size={16} color={colors.muted} />
          <Text style={[styles.labelText, { color: colors.muted }]}>Monthly budget</Text>
        </View>
        <Text style={[styles.amount, { color: over ? colors.danger : colors.ink }]}>
          {formatMoney(status.spent, currency)}
          <Text style={{ color: colors.muted, fontWeight: '400' }}> / {formatMoney(status.limit, currency)}</Text>
        </Text>
      </View>

      <ProgressBar ratio={status.ratio} level={status.level} />

      <View style={styles.footer}>
        {over ? (
          <View style={styles.overRow}>
            <AlertTriangle size={13} color={colors.danger} />
            <Text style={[styles.overText, { color: colors.danger }]}>
              {formatMoney(status.spent - status.limit, currency)} over budget
            </Text>
          </View>
        ) : (
          <Text style={[styles.left, { color: colors.muted }]}>
            {formatMoney(Math.max(0, status.remaining), currency)} left
          </Text>
        )}
        <Text style={[styles.pct, { color: warn || over ? colors.ink : colors.muted }]}>
          {Math.round(status.ratio * 100)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  labelText: { fontSize: 14, fontWeight: '500' },
  amount: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  overRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  overText: { fontSize: 12, fontWeight: '500' },
  left: { fontSize: 12 },
  pct: { fontSize: 12, fontVariant: ['tabular-nums'] },
});
