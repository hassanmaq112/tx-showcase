import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays, Plus, Receipt, Wallet } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { StatCard } from '@/components/analytics/StatCard';
import { BudgetBar } from '@/components/budget/BudgetBar';
import { ExpenseList } from '@/components/expense/ExpenseList';
import { ReceiptLightbox } from '@/components/expense/ReceiptLightbox';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/hooks/useAppStore';
import { useBudgetStatus } from '@/hooks/useBudgetStatus';
import { periodTotals } from '@/lib/analytics';
import { formatMoney } from '@/lib/currency';
import { categoryMap } from '@/store/selectors';
import { useTheme } from '@/theme';
import type { Expense } from '@/types';

function monthLabel() {
  return new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function DashboardScreen() {
  const { state } = useAppStore();
  const { colors } = useTheme();
  const router = useRouter();
  const budget = useBudgetStatus();
  const [lightbox, setLightbox] = useState<Expense | null>(null);

  const currency = state.settings.currency;
  const totals = useMemo(() => periodTotals(state.expenses), [state.expenses]);
  const catMap = useMemo(() => categoryMap(state), [state]);

  const header = (
    <View style={styles.header}>
      <BudgetBar status={budget.global} currency={currency} />
      <View style={styles.stats}>
        <StatCard label="Month" value={formatMoney(totals.month, currency)} icon={<Wallet size={13} color={colors.muted} />} />
        <StatCard label="Week" value={formatMoney(totals.week, currency)} icon={<CalendarDays size={13} color={colors.muted} />} />
        <StatCard label="Daily" value={formatMoney(totals.dailyAverage, currency)} icon={<Receipt size={13} color={colors.muted} />} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScreenHeader title="Expenses" subtitle={monthLabel()} />
      <ExpenseList
        expenses={state.expenses}
        categories={catMap}
        currency={currency}
        onSelect={(e) => router.push(`/edit/${e.id}`)}
        onReceiptPress={setLightbox}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon={Receipt}
            title="No expenses yet"
            description="Tap the + button to log your first expense in seconds."
            action={<Button title="Add expense" icon={<Plus size={18} color={colors.brandInk} />} onPress={() => router.push('/add')} />}
          />
        }
      />
      <ReceiptLightbox visible={Boolean(lightbox)} receiptId={lightbox?.receiptId} onClose={() => setLightbox(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  stats: { flexDirection: 'row', gap: 10 },
});
