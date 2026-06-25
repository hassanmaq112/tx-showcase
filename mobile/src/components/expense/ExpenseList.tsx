import { useMemo, type ReactElement } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { ExpenseCard } from './ExpenseCard';
import { groupExpensesByDay } from '@/lib/dates';
import { formatMoney, roundMoney } from '@/lib/currency';
import { useTheme, radius } from '@/theme';
import type { Category, Expense } from '@/types';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Map<string, Category>;
  currency: string;
  onSelect: (expense: Expense) => void;
  onReceiptPress?: (expense: Expense) => void;
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
}

const FALLBACK = (id: string): Category => ({
  id, name: 'Deleted', icon: 'CircleDashed', color: '#94a3b8', isCustom: true,
});

export function ExpenseList({
  expenses, categories, currency, onSelect, onReceiptPress, ListHeaderComponent, ListEmptyComponent,
}: ExpenseListProps) {
  const { colors } = useTheme();
  const sections = useMemo(() => {
    return groupExpensesByDay(expenses).map((g) => ({
      title: g.label,
      total: roundMoney(g.expenses.reduce((acc, e) => acc + e.amount, 0)),
      data: g.expenses,
    }));
  }, [expenses]);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>{section.title}</Text>
          <Text style={[styles.sectionTotal, { color: colors.muted }]}>{formatMoney(section.total, currency)}</Text>
        </View>
      )}
      renderItem={({ item, index, section }) => {
        const isFirst = index === 0;
        const isLast = index === section.data.length - 1;
        return (
          <View
            style={[
              { backgroundColor: colors.surface, borderColor: colors.border, marginHorizontal: 16 },
              styles.itemWrap,
              isFirst && { borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderTopWidth: StyleSheet.hairlineWidth },
              isLast && { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, borderBottomWidth: StyleSheet.hairlineWidth },
              !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
            ]}
          >
            <ExpenseCard
              expense={item}
              category={categories.get(item.categoryId) ?? FALLBACK(item.categoryId)}
              currency={currency}
              onPress={onSelect}
              onReceiptPress={onReceiptPress}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },
  sectionTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  sectionTotal: { fontSize: 12, fontWeight: '500', fontVariant: ['tabular-nums'] },
  itemWrap: { borderLeftWidth: StyleSheet.hairlineWidth, borderRightWidth: StyleSheet.hairlineWidth },
});
