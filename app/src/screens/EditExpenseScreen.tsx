import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ExpenseForm } from '@/components/expense/ExpenseForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Receipt } from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { deleteReceipt } from '@/lib/receipts';

export function EditExpenseScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
  const [confirm, setConfirm] = useState(false);

  const expense = state.expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <>
        <ScreenHeader title="Expense" />
        <EmptyState
          icon={Receipt}
          title="Expense not found"
          description="It may have been deleted."
        />
      </>
    );
  }

  const doDelete = () => {
    if (expense.receiptId) void deleteReceipt(expense.receiptId);
    dispatch({ type: 'expense/delete', id: expense.id });
    show('Expense deleted.');
    setConfirm(false);
    navigate(-1);
  };

  return (
    <>
      <ScreenHeader
        title="Edit expense"
        leading={
          <button
            onClick={() => navigate(-1)}
            className="-ml-1 grid h-9 w-9 place-items-center rounded-full text-ink no-tap-highlight active:bg-elevated"
            aria-label="Back"
          >
            <ChevronLeft size={24} />
          </button>
        }
        action={
          <button
            onClick={() => setConfirm(true)}
            className="grid h-9 w-9 place-items-center rounded-full text-red-500 no-tap-highlight active:bg-elevated"
            aria-label="Delete expense"
          >
            <Trash2 size={20} />
          </button>
        }
      />
      <ExpenseForm expense={expense} />

      <ConfirmDialog
        open={confirm}
        title="Delete expense?"
        message="This permanently removes the expense and its receipt."
        confirmLabel="Delete"
        destructive
        onConfirm={doDelete}
        onCancel={() => setConfirm(false)}
      />
    </>
  );
}
