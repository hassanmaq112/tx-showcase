import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ExpenseForm } from '@/components/expense/ExpenseForm';

export function AddExpenseScreen() {
  const navigate = useNavigate();
  return (
    <>
      <ScreenHeader
        title="Add expense"
        leading={
          <button
            onClick={() => navigate(-1)}
            className="-ml-1 grid h-9 w-9 place-items-center rounded-full text-ink no-tap-highlight active:bg-elevated"
            aria-label="Back"
          >
            <ChevronLeft size={24} />
          </button>
        }
      />
      <ExpenseForm />
    </>
  );
}
