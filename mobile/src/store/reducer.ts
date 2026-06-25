import { OTHER_CATEGORY_ID } from '@/constants/categories';
import { roundMoney } from '@/lib/currency';
import { uid } from '@/lib/id';
import { defaultData } from '@/lib/storage';
import type { Category, Expense, PersistedData } from '@/types';
import type { Action } from './actions';

export interface AppState extends PersistedData {
  /** False until localStorage load completes; gates the first persistence write. */
  hydrated: boolean;
}

export function initialState(): AppState {
  return { ...defaultData(), hydrated: false };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return { ...action.data, hydrated: true };

    case 'expense/add': {
      const now = Date.now();
      const expense: Expense = {
        ...action.expense,
        amount: roundMoney(action.expense.amount),
        id: uid(),
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, expenses: [expense, ...state.expenses] };
    }

    case 'expense/update': {
      const expenses = state.expenses.map((e) =>
        e.id === action.id
          ? {
              ...e,
              ...action.patch,
              amount:
                action.patch.amount != null ? roundMoney(action.patch.amount) : e.amount,
              updatedAt: Date.now(),
            }
          : e,
      );
      return { ...state, expenses };
    }

    case 'expense/delete':
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.id) };

    case 'category/add': {
      const category: Category = { ...action.category, isCustom: true };
      return { ...state, categories: [...state.categories, category] };
    }

    case 'category/update': {
      const categories = state.categories.map((c) =>
        c.id === action.id ? { ...c, ...action.patch } : c,
      );
      return { ...state, categories };
    }

    case 'category/delete': {
      // The protected fallback category cannot be deleted.
      if (action.id === OTHER_CATEGORY_ID) return state;
      const reassignTo = action.reassignToId || OTHER_CATEGORY_ID;
      const expenses = state.expenses.map((e) =>
        e.categoryId === action.id ? { ...e, categoryId: reassignTo, updatedAt: Date.now() } : e,
      );
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.id),
        budgets: {
          ...state.budgets,
          perCategory: state.budgets.perCategory.filter((b) => b.categoryId !== action.id),
        },
        expenses,
      };
    }

    case 'budgets/set':
      return { ...state, budgets: action.budgets };

    case 'settings/set':
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case 'data/import':
      return { ...action.data, hydrated: true };

    case 'data/clear':
      return { ...defaultData(), hydrated: true };

    default:
      return state;
  }
}
