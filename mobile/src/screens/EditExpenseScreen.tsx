import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Receipt, Trash2 } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ExpenseForm } from '@/components/expense/ExpenseForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { deleteReceipt } from '@/lib/receipts';
import { useTheme } from '@/theme';

export function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
  const [confirm, setConfirm] = useState(false);

  const expense = state.expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.canvas }}>
        <ScreenHeader title="Expense" leading={<Pressable onPress={() => router.back()} hitSlop={8}><ChevronLeft size={26} color={colors.ink} /></Pressable>} />
        <EmptyState icon={Receipt} title="Expense not found" description="It may have been deleted." />
      </View>
    );
  }

  const doDelete = () => {
    if (expense.receiptId) void deleteReceipt(expense.receiptId);
    dispatch({ type: 'expense/delete', id: expense.id });
    show('Expense deleted.');
    setConfirm(false);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScreenHeader
        title="Edit expense"
        leading={<Pressable onPress={() => router.back()} hitSlop={8}><ChevronLeft size={26} color={colors.ink} /></Pressable>}
        action={<Pressable onPress={() => setConfirm(true)} hitSlop={8}><Trash2 size={22} color={colors.danger} /></Pressable>}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
          <ExpenseForm expense={expense} />
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmDialog
        visible={confirm}
        title="Delete expense?"
        message="This permanently removes the expense and its receipt."
        confirmLabel="Delete"
        destructive
        onConfirm={doDelete}
        onCancel={() => setConfirm(false)}
      />
    </View>
  );
}
