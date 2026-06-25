import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BarChart3, CalendarDays, TrendingUp, Wallet } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { StatCard } from '@/components/analytics/StatCard';
import { MoMComparison } from '@/components/analytics/MoMComparison';
import { TopCategories } from '@/components/analytics/TopCategories';
import { CategoryPieChart } from '@/components/analytics/CategoryPieChart';
import { TrendLineChart } from '@/components/analytics/TrendLineChart';
import { CategoryBudgetRow } from '@/components/budget/CategoryBudgetRow';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/hooks/useAppStore';
import { useBudgetStatus } from '@/hooks/useBudgetStatus';
import { categoryBreakdown, monthOverMonth, monthlyTrend, periodTotals } from '@/lib/analytics';
import { formatMoney } from '@/lib/currency';
import { categoryMap } from '@/store/selectors';
import { useTheme } from '@/theme';

function monthLabel() {
  return new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function AnalyticsScreen() {
  const { state } = useAppStore();
  const { colors } = useTheme();
  const budget = useBudgetStatus();
  const currency = state.settings.currency;

  const totals = useMemo(() => periodTotals(state.expenses), [state.expenses]);
  const breakdown = useMemo(() => categoryBreakdown(state.expenses, state.categories), [state.expenses, state.categories]);
  const trend = useMemo(() => monthlyTrend(state.expenses), [state.expenses]);
  const mom = useMemo(() => monthOverMonth(state.expenses), [state.expenses]);
  const catMap = useMemo(() => categoryMap(state), [state]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScreenHeader title="Statistics" subtitle={monthLabel()} />
      {state.expenses.length === 0 ? (
        <EmptyState icon={BarChart3} title="Nothing to chart yet" description="Add a few expenses and your spending insights will appear here." />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.stats}>
            <StatCard label="Month" value={formatMoney(totals.month, currency)} icon={<Wallet size={13} color={colors.muted} />} />
            <StatCard label="Week" value={formatMoney(totals.week, currency)} icon={<CalendarDays size={13} color={colors.muted} />} />
            <StatCard label="Daily" value={formatMoney(totals.dailyAverage, currency)} icon={<TrendingUp size={13} color={colors.muted} />} />
          </View>

          <MoMComparison data={mom} currency={currency} />

          {breakdown.length > 0 && (
            <Card title="Spending by category">
              <CategoryPieChart data={breakdown} />
              <View style={{ marginTop: 12 }}>
                <TopCategories data={breakdown} currency={currency} />
              </View>
            </Card>
          )}

          <Card title="Last 12 months">
            <TrendLineChart data={trend} currency={currency} />
          </Card>

          {state.budgets.perCategory.length > 0 && (
            <Card title="Category budgets">
              {state.budgets.perCategory.map((cb) => {
                const category = catMap.get(cb.categoryId);
                const status = budget.byCategory.get(cb.categoryId);
                if (!category || !status) return null;
                return <CategoryBudgetRow key={cb.categoryId} category={category} status={status} currency={currency} />;
              })}
            </Card>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 120 },
  stats: { flexDirection: 'row', gap: 10 },
});
