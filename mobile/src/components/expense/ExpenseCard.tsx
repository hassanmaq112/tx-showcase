import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { CategoryBadge } from './CategoryPill';
import { useReceiptUrl } from '@/hooks/useReceiptUrl';
import { formatMoney } from '@/lib/currency';
import { useTheme } from '@/theme';
import type { Category, Expense } from '@/types';

interface ExpenseCardProps {
  expense: Expense;
  category: Category;
  currency: string;
  onPress: (expense: Expense) => void;
  onReceiptPress?: (expense: Expense) => void;
}

function ExpenseCardImpl({ expense, category, currency, onPress, onReceiptPress }: ExpenseCardProps) {
  const { colors } = useTheme();
  const receiptUrl = useReceiptUrl(expense.receiptId);

  return (
    <Pressable onPress={() => onPress(expense)} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.elevated }]}>
      <CategoryBadge category={category} />
      <View style={styles.mid}>
        <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>{category.name}</Text>
        <Text style={[styles.note, { color: colors.muted }]} numberOfLines={1}>
          {expense.notes || 'No note'}
        </Text>
      </View>
      {receiptUrl ? (
        <Pressable onPress={() => onReceiptPress?.(expense)} hitSlop={6}>
          <Image source={{ uri: receiptUrl }} style={[styles.thumb, { borderColor: colors.border }]} contentFit="cover" />
        </Pressable>
      ) : null}
      <View style={styles.amountWrap}>
        <Text style={[styles.amount, { color: colors.ink }]}>{formatMoney(expense.amount, currency)}</Text>
        <ChevronRight size={16} color={colors.muted} />
      </View>
    </Pressable>
  );
}

export const ExpenseCard = memo(ExpenseCardImpl);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  mid: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500' },
  note: { fontSize: 13, marginTop: 1 },
  thumb: { width: 40, height: 40, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth },
  amountWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  amount: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
