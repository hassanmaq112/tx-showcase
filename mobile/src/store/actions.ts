import type { Budgets, Category, Expense, PersistedData, Settings } from '@/types';

/** Input for creating an expense (id/timestamps are assigned by the reducer). */
export type NewExpense = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

export type Action =
  | { type: 'hydrate'; data: PersistedData }
  | { type: 'expense/add'; expense: NewExpense }
  | { type: 'expense/update'; id: string; patch: Partial<NewExpense> }
  | { type: 'expense/delete'; id: string }
  | { type: 'category/add'; category: Omit<Category, 'isCustom'> }
  | { type: 'category/update'; id: string; patch: Partial<Omit<Category, 'id' | 'isCustom'>> }
  | { type: 'category/delete'; id: string; reassignToId: string }
  | { type: 'budgets/set'; budgets: Budgets }
  | { type: 'settings/set'; patch: Partial<Settings> }
  | { type: 'data/import'; data: PersistedData }
  | { type: 'data/clear' };
