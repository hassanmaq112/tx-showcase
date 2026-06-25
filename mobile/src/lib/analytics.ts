import type {
  Category,
  CategoryBreakdownItem,
  Expense,
  MonthOverMonth,
  PeriodTotals,
  TrendPoint,
} from '@/types';
import { roundMoney } from './currency';
import { isInRange, last12Months, monthRange, weekRange } from './dates';

function sum(expenses: Expense[]): number {
  return roundMoney(expenses.reduce((acc, e) => acc + e.amount, 0));
}

/** Month total, week total, and daily average for the month containing `ref`. */
export function periodTotals(expenses: Expense[], ref: Date = new Date()): PeriodTotals {
  const month = monthRange(ref);
  const week = weekRange(ref);
  const monthTotal = sum(expenses.filter((e) => isInRange(e.date, month)));
  const weekTotal = sum(expenses.filter((e) => isInRange(e.date, week)));
  const dayOfMonth = ref.getDate();
  return {
    month: monthTotal,
    week: weekTotal,
    dailyAverage: dayOfMonth > 0 ? roundMoney(monthTotal / dayOfMonth) : 0,
  };
}

/** Spend per category for the month of `ref`, keyed by categoryId. */
export function spentByCategoryThisMonth(
  expenses: Expense[],
  ref: Date = new Date(),
): Record<string, number> {
  const month = monthRange(ref);
  const totals: Record<string, number> = {};
  for (const e of expenses) {
    if (!isInRange(e.date, month)) continue;
    totals[e.categoryId] = (totals[e.categoryId] ?? 0) + e.amount;
  }
  for (const key of Object.keys(totals)) totals[key] = roundMoney(totals[key]);
  return totals;
}

/**
 * Category breakdown for the month of `ref`, sorted by total desc,
 * with each category's share as a percent of the period total.
 */
export function categoryBreakdown(
  expenses: Expense[],
  categories: Category[],
  ref: Date = new Date(),
): CategoryBreakdownItem[] {
  const totals = spentByCategoryThisMonth(expenses, ref);
  const grand = Object.values(totals).reduce((a, b) => a + b, 0);
  const byId = new Map(categories.map((c) => [c.id, c]));
  return Object.entries(totals)
    .map(([categoryId, total]) => {
      const category =
        byId.get(categoryId) ??
        ({
          id: categoryId,
          name: 'Deleted',
          icon: 'CircleDashed',
          color: '#94a3b8',
          isCustom: true,
        } as Category);
      return {
        category,
        total,
        percent: grand > 0 ? roundMoney((total / grand) * 100) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export function topCategories(
  breakdown: CategoryBreakdownItem[],
  n = 3,
): CategoryBreakdownItem[] {
  return breakdown.slice(0, n);
}

/** Total spend per month for the trailing 12 months. */
export function monthlyTrend(expenses: Expense[], ref: Date = new Date()): TrendPoint[] {
  const slots = last12Months(ref);
  const totals = new Map<string, number>();
  for (const e of expenses) {
    const key = e.date.slice(0, 7);
    totals.set(key, (totals.get(key) ?? 0) + e.amount);
  }
  return slots.map((slot) => ({
    monthKey: slot.monthKey,
    label: slot.label,
    total: roundMoney(totals.get(slot.monthKey) ?? 0),
  }));
}

/** This month vs last month, with percent change (null when last month is 0). */
export function monthOverMonth(expenses: Expense[], ref: Date = new Date()): MonthOverMonth {
  const current = sum(expenses.filter((e) => isInRange(e.date, monthRange(ref))));
  const prevRef = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
  const previous = sum(expenses.filter((e) => isInRange(e.date, monthRange(prevRef))));
  const deltaPct = previous > 0 ? roundMoney(((current - previous) / previous) * 100) : null;
  return { current, previous, deltaPct };
}
