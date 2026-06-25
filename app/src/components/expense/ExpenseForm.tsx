import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { ReceiptPicker } from './ReceiptPicker';
import { CategoryEditor, type CategoryDraft } from '@/components/settings/CategoryEditor';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { currencySymbol, formatMoney } from '@/lib/currency';
import { isInRange, monthRange, todayISO } from '@/lib/dates';
import { uid } from '@/lib/id';
import type { Expense } from '@/types';

interface ExpenseFormProps {
  /** Provided in edit mode. */
  expense?: Expense;
}

export function ExpenseForm({ expense }: ExpenseFormProps) {
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
  const navigate = useNavigate();
  const isEdit = Boolean(expense);

  const [date, setDate] = useState(expense?.date ?? todayISO());
  const [categoryId, setCategoryId] = useState(
    expense?.categoryId ?? state.categories[0]?.id ?? '',
  );
  const [amountText, setAmountText] = useState(expense ? String(expense.amount) : '');
  const [notes, setNotes] = useState(expense?.notes ?? '');
  const [receiptId, setReceiptId] = useState<string | undefined>(expense?.receiptId);
  const [error, setError] = useState<string>();
  const [showNewCategory, setShowNewCategory] = useState(false);

  const symbol = currencySymbol(state.settings.currency);

  const parseAmount = (): number | null => {
    const normalized = amountText.replace(',', '.').trim();
    if (!normalized) return null;
    const value = Number(normalized);
    if (!Number.isFinite(value) || value <= 0) return null;
    return value;
  };

  /** Warn if this expense pushes the month over the global budget. */
  const checkBudget = (amount: number) => {
    const limit = state.budgets.globalMonthly;
    if (limit == null || limit <= 0) return;
    const ref = new Date();
    const range = monthRange(ref);
    if (!isInRange(date, range)) return;
    const priorSpent = state.expenses
      .filter((e) => e.id !== expense?.id && isInRange(e.date, range))
      .reduce((acc, e) => acc + e.amount, 0);
    const projected = priorSpent + amount;
    if (projected > limit) {
      show(
        `Over budget — ${formatMoney(projected - limit, state.settings.currency)} above your monthly limit.`,
        'warn',
      );
    } else if (projected >= limit * state.settings.warnThreshold) {
      show(
        `Heads up — ${formatMoney(limit - projected, state.settings.currency)} left this month.`,
        'info',
      );
    }
  };

  const handleQuickAdd = (draft: CategoryDraft) => {
    // Generate the id here so we can select the new category immediately.
    const id = uid();
    dispatch({ type: 'category/add', category: { id, ...draft } });
    setCategoryId(id);
    setShowNewCategory(false);
  };

  const submit = () => {
    const amount = parseAmount();
    if (amount == null) {
      setError('Enter a valid amount greater than 0.');
      return;
    }
    if (!categoryId) {
      setError('Pick a category.');
      return;
    }

    const payload = { date, categoryId, amount, notes: notes.trim() || undefined, receiptId };

    if (isEdit && expense) {
      dispatch({ type: 'expense/update', id: expense.id, patch: payload });
      show('Expense updated.');
    } else {
      dispatch({ type: 'expense/add', expense: payload });
      show('Expense saved.');
    }
    checkBudget(amount);
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      <Field label="Amount" htmlFor="amount" error={error}>
        <Input
          id="amount"
          inputMode="decimal"
          prefix={symbol}
          placeholder="0.00"
          value={amountText}
          onChange={(e) => {
            setAmountText(e.target.value);
            setError(undefined);
          }}
          invalid={Boolean(error)}
          className="text-lg font-semibold"
          autoFocus={!isEdit}
        />
      </Field>

      <Field label="Category">
        <div className="flex gap-2">
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex-1"
          >
            {state.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            size="md"
            className="px-3"
            onClick={() => setShowNewCategory(true)}
            aria-label="New category"
          >
            <Plus size={18} />
          </Button>
        </div>
      </Field>

      <Field label="Date" htmlFor="date">
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>

      <Field label="Notes" htmlFor="notes" hint="Optional">
        <TextArea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What was this for?"
          maxLength={200}
        />
      </Field>

      <Field label="Receipt" hint="Stored privately on this device">
        <ReceiptPicker value={receiptId} onChange={setReceiptId} />
      </Field>

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" fullWidth size="lg" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button fullWidth size="lg" onClick={submit}>
          {isEdit ? 'Save' : 'Add expense'}
        </Button>
      </div>

      <CategoryEditor
        open={showNewCategory}
        onClose={() => setShowNewCategory(false)}
        onSave={handleQuickAdd}
      />
    </div>
  );
}
