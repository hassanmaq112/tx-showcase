import { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { CategoryBadge } from '@/components/expense/CategoryPill';
import { useAppStore } from '@/hooks/useAppStore';
import { currencySymbol, roundMoney } from '@/lib/currency';
import type { Budgets } from '@/types';

/** Parse a budget input; empty/invalid → null (no limit). */
function parseLimit(text: string): number | null {
  const v = Number(text.replace(',', '.').trim());
  if (!Number.isFinite(v) || v <= 0) return null;
  return roundMoney(v);
}

export function BudgetSettings() {
  const { state, dispatch } = useAppStore();
  const symbol = currencySymbol(state.settings.currency);

  const [global, setGlobal] = useState(
    state.budgets.globalMonthly != null ? String(state.budgets.globalMonthly) : '',
  );

  const commitGlobal = () => {
    const next: Budgets = { ...state.budgets, globalMonthly: parseLimit(global) };
    dispatch({ type: 'budgets/set', budgets: next });
  };

  const limitFor = (categoryId: string) =>
    state.budgets.perCategory.find((b) => b.categoryId === categoryId)?.monthlyLimit;

  const commitCategory = (categoryId: string, text: string) => {
    const limit = parseLimit(text);
    const rest = state.budgets.perCategory.filter((b) => b.categoryId !== categoryId);
    const perCategory = limit != null ? [...rest, { categoryId, monthlyLimit: limit }] : rest;
    dispatch({ type: 'budgets/set', budgets: { ...state.budgets, perCategory } });
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Monthly budget" hint="Leave blank for no overall limit">
        <Input
          inputMode="decimal"
          prefix={symbol}
          placeholder="0.00"
          value={global}
          onChange={(e) => setGlobal(e.target.value)}
          onBlur={commitGlobal}
        />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Per-category limits</p>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface divide-y divide-border">
          {state.categories.map((c) => (
            <CategoryLimitRow
              key={c.id}
              symbol={symbol}
              name={c.name}
              color={c.color}
              icon={c.icon}
              initial={limitFor(c.id)}
              onCommit={(text) => commitCategory(c.id, text)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  symbol: string;
  name: string;
  color: string;
  icon: string;
  initial: number | undefined;
  onCommit: (text: string) => void;
}

function CategoryLimitRow({ symbol, name, color, icon, initial, onCommit }: RowProps) {
  const [text, setText] = useState(initial != null ? String(initial) : '');
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <CategoryBadge category={{ id: name, name, color, icon, isCustom: true }} size={32} />
      <span className="flex-1 truncate text-sm text-ink">{name}</span>
      <div className="w-28">
        <Input
          inputMode="decimal"
          prefix={symbol}
          placeholder="—"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => onCommit(text)}
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
}
