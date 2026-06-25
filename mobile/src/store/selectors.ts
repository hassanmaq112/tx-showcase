import type { BudgetLevel, BudgetStatus, Category } from '@/types';
import type { AppState } from './reducer';

/** Build a lookup map of categories by id. */
export function categoryMap(state: AppState): Map<string, Category> {
  return new Map(state.categories.map((c) => [c.id, c]));
}

/** Resolve the budget alert level from a spent/limit ratio. */
export function budgetLevel(
  ratio: number,
  hasLimit: boolean,
  warnThreshold: number,
): BudgetLevel {
  if (!hasLimit) return 'none';
  if (ratio > 1) return 'over';
  if (ratio >= warnThreshold) return 'warn';
  return 'ok';
}

/** Compute a BudgetStatus from spent + optional limit. */
export function makeBudgetStatus(
  spent: number,
  limit: number | null,
  warnThreshold: number,
): BudgetStatus {
  const hasLimit = limit != null && limit > 0;
  const ratio = hasLimit ? spent / (limit as number) : 0;
  return {
    spent,
    limit,
    ratio,
    remaining: hasLimit ? (limit as number) - spent : 0,
    level: budgetLevel(ratio, hasLimit, warnThreshold),
  };
}
