import { lazy, useMemo } from 'react';
import { BarChart3, CalendarDays, TrendingUp, Wallet } from 'lucide-react';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { StatCard } from '@/components/analytics/StatCard';
import { ChartContainer } from '@/components/analytics/ChartContainer';
import { MoMComparison } from '@/components/analytics/MoMComparison';
import { TopCategories } from '@/components/analytics/TopCategories';
import { CategoryBudgetRow } from '@/components/budget/CategoryBudgetRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/hooks/useAppStore';
import { useBudgetStatus } from '@/hooks/useBudgetStatus';
import { useTheme } from '@/hooks/useTheme';
import {
  categoryBreakdown,
  monthOverMonth,
  monthlyTrend,
  periodTotals,
} from '@/lib/analytics';
import { formatMoney } from '@/lib/currency';
import { categoryMap } from '@/store/selectors';

// Recharts is heavy — load chart components only when this screen renders.
const CategoryPieChart = lazy(() => import('@/components/analytics/CategoryPieChart'));
const TrendLineChart = lazy(() => import('@/components/analytics/TrendLineChart'));

export function AnalyticsScreen() {
  const { state } = useAppStore();
  const budget = useBudgetStatus();
  const theme = useTheme();
  const currency = state.settings.currency;

  const totals = useMemo(() => periodTotals(state.expenses), [state.expenses]);
  const breakdown = useMemo(
    () => categoryBreakdown(state.expenses, state.categories),
    [state.expenses, state.categories],
  );
  const trend = useMemo(() => monthlyTrend(state.expenses), [state.expenses]);
  const mom = useMemo(() => monthOverMonth(state.expenses), [state.expenses]);
  const catMap = useMemo(() => categoryMap(state), [state]);

  // Resolve the brand color to a concrete value for SVG fills.
  const brandColor = theme === 'dark' ? '#818cf8' : '#4f46e5';
  const categoryBudgets = state.budgets.perCategory;

  return (
    <>
      <ScreenHeader title="Statistics" subtitle={monthLabel()} />

      {state.expenses.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Nothing to chart yet"
          description="Add a few expenses and your spending insights will appear here."
        />
      ) : (
        <div className="flex flex-col gap-5 px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Month" value={formatMoney(totals.month, currency)} icon={<Wallet size={13} />} />
            <StatCard label="Week" value={formatMoney(totals.week, currency)} icon={<CalendarDays size={13} />} />
            <StatCard label="Daily" value={formatMoney(totals.dailyAverage, currency)} icon={<TrendingUp size={13} />} />
          </div>

          <MoMComparison data={mom} currency={currency} />

          {breakdown.length > 0 && (
            <Card title="Spending by category">
              <ChartContainer height={220}>
                <CategoryPieChart data={breakdown} currency={currency} />
              </ChartContainer>
              <div className="mt-4">
                <TopCategories data={breakdown} currency={currency} />
              </div>
            </Card>
          )}

          <Card title="Last 12 months">
            <ChartContainer height={220}>
              <TrendLineChart data={trend} currency={currency} color={brandColor} />
            </ChartContainer>
          </Card>

          {categoryBudgets.length > 0 && (
            <Card title="Category budgets">
              <div className="divide-y divide-border">
                {categoryBudgets.map((cb) => {
                  const category = catMap.get(cb.categoryId);
                  const status = budget.byCategory.get(cb.categoryId);
                  if (!category || !status) return null;
                  return (
                    <CategoryBudgetRow
                      key={cb.categoryId}
                      category={category}
                      status={status}
                      currency={currency}
                    />
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function monthLabel(): string {
  return new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
