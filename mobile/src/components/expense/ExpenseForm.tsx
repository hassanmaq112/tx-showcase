import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { ReceiptPicker } from './ReceiptPicker';
import { CategoryEditor, type CategoryDraft } from '@/components/settings/CategoryEditor';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { currencySymbol, formatMoney } from '@/lib/currency';
import { isInRange, monthRange, todayISO } from '@/lib/dates';
import { uid } from '@/lib/id';
import { useTheme } from '@/theme';
import type { Expense } from '@/types';

export function ExpenseForm({ expense }: { expense?: Expense }) {
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
  const router = useRouter();
  const { colors } = useTheme();
  const isEdit = Boolean(expense);

  const [date, setDate] = useState(expense?.date ?? todayISO());
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? state.categories[0]?.id ?? '');
  const [amountText, setAmountText] = useState(expense ? String(expense.amount) : '');
  const [notes, setNotes] = useState(expense?.notes ?? '');
  const [receiptId, setReceiptId] = useState<string | undefined>(expense?.receiptId);
  const [error, setError] = useState<string>();
  const [showNewCategory, setShowNewCategory] = useState(false);

  const symbol = currencySymbol(state.settings.currency);

  const parseAmount = (): number | null => {
    const normalized = amountText.replace(',', '.').trim();
    if (!normalized) return null;
    const v = Number(normalized);
    return Number.isFinite(v) && v > 0 ? v : null;
  };

  const checkBudget = (amount: number) => {
    const limit = state.budgets.globalMonthly;
    if (limit == null || limit <= 0) return;
    const range = monthRange(new Date());
    if (!isInRange(date, range)) return;
    const prior = state.expenses
      .filter((e) => e.id !== expense?.id && isInRange(e.date, range))
      .reduce((acc, e) => acc + e.amount, 0);
    const projected = prior + amount;
    if (projected > limit) {
      show(`Over budget — ${formatMoney(projected - limit, state.settings.currency)} above your monthly limit.`, 'warn');
    } else if (projected >= limit * state.settings.warnThreshold) {
      show(`Heads up — ${formatMoney(limit - projected, state.settings.currency)} left this month.`, 'info');
    }
  };

  const handleQuickAdd = (draft: CategoryDraft) => {
    const id = uid();
    dispatch({ type: 'category/add', category: { id, ...draft } });
    setCategoryId(id);
    setShowNewCategory(false);
  };

  const submit = () => {
    const amount = parseAmount();
    if (amount == null) { setError('Enter a valid amount greater than 0.'); return; }
    if (!categoryId) { setError('Pick a category.'); return; }
    const payload = { date, categoryId, amount, notes: notes.trim() || undefined, receiptId };
    if (isEdit && expense) {
      dispatch({ type: 'expense/update', id: expense.id, patch: payload });
      show('Expense updated.');
    } else {
      dispatch({ type: 'expense/add', expense: payload });
      show('Expense saved.');
    }
    checkBudget(amount);
    router.back();
  };

  return (
    <View style={styles.form}>
      <Field label="Amount" error={error}>
        <Input
          value={amountText}
          onChangeText={(t) => { setAmountText(t); setError(undefined); }}
          keyboardType="decimal-pad"
          prefix={symbol}
          placeholder="0.00"
          invalid={Boolean(error)}
          style={{ fontWeight: '600', fontSize: 18 }}
          autoFocus={!isEdit}
        />
      </Field>

      <Field label="Category">
        <View style={styles.catRow}>
          <View style={{ flex: 1 }}>
            <Select
              value={categoryId}
              onChange={setCategoryId}
              title="Category"
              options={state.categories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </View>
          <Button variant="secondary" icon={<Plus size={18} color={colors.ink} />} onPress={() => setShowNewCategory(true)} />
        </View>
      </Field>

      <Field label="Date">
        <DatePickerField value={date} onChange={setDate} />
      </Field>

      <Field label="Notes" hint="Optional">
        <TextArea value={notes} onChangeText={setNotes} placeholder="What was this for?" maxLength={200} />
      </Field>

      <Field label="Receipt" hint="Stored on this device (and synced when signed in)">
        <ReceiptPicker value={receiptId} onChange={setReceiptId} />
      </Field>

      <View style={styles.actions}>
        <Button title="Cancel" variant="secondary" fullWidth onPress={() => router.back()} style={{ flex: 1 }} />
        <Button title={isEdit ? 'Save' : 'Add expense'} fullWidth onPress={submit} style={{ flex: 1 }} testID="submit-expense" />
      </View>

      <CategoryEditor visible={showNewCategory} onClose={() => setShowNewCategory(false)} onSave={handleQuickAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16, gap: 18 },
  catRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
});
