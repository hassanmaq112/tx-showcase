import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { CategoryBadge } from '@/components/expense/CategoryPill';
import { useAppStore } from '@/hooks/useAppStore';
import { currencySymbol, roundMoney } from '@/lib/currency';
import { useTheme, radius } from '@/theme';
import type { Budgets } from '@/types';

function parseLimit(text: string): number | null {
  const v = Number(text.replace(',', '.').trim());
  return Number.isFinite(v) && v > 0 ? roundMoney(v) : null;
}

export function BudgetSettings() {
  const { state, dispatch } = useAppStore();
  const { colors } = useTheme();
  const symbol = currencySymbol(state.settings.currency);
  const [global, setGlobal] = useState(state.budgets.globalMonthly != null ? String(state.budgets.globalMonthly) : '');

  const commitGlobal = () => {
    const next: Budgets = { ...state.budgets, globalMonthly: parseLimit(global) };
    dispatch({ type: 'budgets/set', budgets: next });
  };

  const limitFor = (id: string) => state.budgets.perCategory.find((b) => b.categoryId === id)?.monthlyLimit;

  const commitCategory = (categoryId: string, text: string) => {
    const limit = parseLimit(text);
    const rest = state.budgets.perCategory.filter((b) => b.categoryId !== categoryId);
    const perCategory = limit != null ? [...rest, { categoryId, monthlyLimit: limit }] : rest;
    dispatch({ type: 'budgets/set', budgets: { ...state.budgets, perCategory } });
  };

  return (
    <View style={{ gap: 18 }}>
      <Field label="Monthly budget" hint="Leave blank for no overall limit">
        <Input value={global} onChangeText={setGlobal} onEndEditing={commitGlobal} keyboardType="decimal-pad" prefix={symbol} placeholder="0.00" />
      </Field>

      <View>
        <Text style={[styles.subhead, { color: colors.ink }]}>Per-category limits</Text>
        <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl }]}>
          {state.categories.map((c, i) => (
            <CategoryLimitRow
              key={c.id}
              symbol={symbol}
              category={c}
              initial={limitFor(c.id)}
              onCommit={(t) => commitCategory(c.id, t)}
              divider={i < state.categories.length - 1}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function CategoryLimitRow({ symbol, category, initial, onCommit, divider }: {
  symbol: string;
  category: { id: string; name: string; icon: string; color: string; isCustom: boolean };
  initial: number | undefined;
  onCommit: (text: string) => void;
  divider: boolean;
}) {
  const { colors } = useTheme();
  const [text, setText] = useState(initial != null ? String(initial) : '');
  return (
    <View style={[styles.row, divider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <CategoryBadge category={category} size={32} />
      <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>{category.name}</Text>
      <View style={{ width: 110 }}>
        <Input value={text} onChangeText={setText} onEndEditing={() => onCommit(text)} keyboardType="decimal-pad" prefix={symbol} placeholder="—" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subhead: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  list: { borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  name: { flex: 1, fontSize: 14 },
});
