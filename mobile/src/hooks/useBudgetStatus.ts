import { useMemo } from 'react';
import { spentByCategoryThisMonth } from '@/lib/analytics';
import { isInRange, monthRange } from '@/lib/dates';
import { roundMoney } from '@/lib/currency';
import { makeBudgetStatus } from '@/store/selectors';
import type { BudgetStatus } from '@/types';
import { useAppStore } from './useAppStore';

export interface BudgetSummary {
  global: BudgetStatus;
  byCategory: Map<string, BudgetStatus>;
}

/** Compute global + per-category budget status for the current month. */
export function useBudgetStatus(ref: Date = new Date()): BudgetSummary {
  const { state } = useAppStore();
  const refTime = ref.getTime();

  return useMemo(() => {
    const month = monthRange(ref);
    const monthSpent = roundMoney(
      state.expenses
        .filter((e) => isInRange(e.date, month))
        .reduce((acc, e) => acc + e.amount, 0),
    );
    const global = makeBudgetStatus(
      monthSpent,
      state.budgets.globalMonthly,
      state.settings.warnThreshold,
    );

    const perCatSpent = spentByCategoryThisMonth(state.expenses, ref);
    const byCategory = new Map<string, BudgetStatus>();
    for (const cb of state.budgets.perCategory) {
      byCategory.set(
        cb.categoryId,
        makeBudgetStatus(
          perCatSpent[cb.categoryId] ?? 0,
          cb.monthlyLimit,
          state.settings.warnThreshold,
        ),
      );
    }
    return { global, byCategory };
    // refTime captures the date dependency without re-running on identical Dates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.expenses, state.budgets, state.settings.warnThreshold, refTime]);
}
