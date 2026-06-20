import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus, Receipt, Wallet } from 'lucide-react';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { StatCard } from '@/components/analytics/StatCard';
import { BudgetBar } from '@/components/budget/BudgetBar';
import { ExpenseList } from '@/components/expense/ExpenseList';
import { ReceiptLightbox } from '@/components/expense/ReceiptLightbox';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/hooks/useAppStore';
import { useBudgetStatus } from '@/hooks/useBudgetStatus';
import { DASHBOARD_RECENT_LIMIT } from '@/constants/config';
import { periodTotals } from '@/lib/analytics';
import { formatMoney } from '@/lib/currency';
import { categoryMap } from '@/store/selectors';
import type { Expense } from '@/types';

export function DashboardScreen() {
  const { state } = useAppStore();
  const navigate = useNavigate();
  const budget = useBudgetStatus();
  const [lightbox, setLightbox] = useState<Expense | null>(null);

  const currency = state.settings.currency;
  const totals = useMemo(() => periodTotals(state.expenses), [state.expenses]);
  const catMap = useMemo(() => categoryMap(state), [state]);
  const recent = useMemo(
    () =>
      [...state.expenses]
        .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1))
        .slice(0, DASHBOARD_RECENT_LIMIT),
    [state.expenses],
  );

  return (
    <>
      <ScreenHeader title="Expenses" subtitle={monthLabel()} />

      <div className="flex flex-col gap-4 px-4 py-4">
        <BudgetBar status={budget.global} currency={currency} />

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Month"
            value={formatMoney(totals.month, currency)}
            icon={<Wallet size={13} />}
          />
          <StatCard
            label="Week"
            value={formatMoney(totals.week, currency)}
            icon={<CalendarDays size={13} />}
          />
          <StatCard
            label="Daily avg"
            value={formatMoney(totals.dailyAverage, currency)}
            icon={<Receipt size={13} />}
          />
        </div>
      </div>

      {state.expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses yet"
          description="Tap the + button to log your first expense in seconds."
          action={
            <Button onClick={() => navigate('/add')}>
              <Plus size={18} />
              Add expense
            </Button>
          }
        />
      ) : (
        <div className="mt-1">
          <div className="flex items-center justify-between px-4 pb-1">
            <h2 className="text-base font-semibold text-ink">Recent</h2>
            {state.expenses.length > recent.length && (
              <button
                onClick={() => navigate('/analytics')}
                className="text-sm font-medium text-brand no-tap-highlight"
              >
                See stats
              </button>
            )}
          </div>
          <ExpenseList
            expenses={recent}
            categories={catMap}
            currency={currency}
            onSelect={(e) => navigate(`/edit/${e.id}`)}
            onReceiptClick={setLightbox}
          />
        </div>
      )}

      <ReceiptLightbox
        open={Boolean(lightbox)}
        receiptId={lightbox?.receiptId}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}

function monthLabel(): string {
  return new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
