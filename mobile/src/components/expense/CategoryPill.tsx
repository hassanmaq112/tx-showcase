import { StyleSheet, Text, View } from 'react-native';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { withAlpha } from '@/theme';
import type { Category } from '@/types';

/** Small colored chip with the category icon + name. */
export function CategoryPill({ category }: { category: Category }) {
  return (
    <View style={[styles.pill, { backgroundColor: withAlpha(category.color, 0.12) }]}>
      <CategoryIcon name={category.icon} size={13} color={category.color} />
      <Text style={[styles.text, { color: category.color }]}>{category.name}</Text>
    </View>
  );
}

/** Rounded square icon badge in the category color. */
export function CategoryBadge({ category, size = 40 }: { category: Category; size?: number }) {
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size * 0.3,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: withAlpha(category.color, 0.12),
      }}
    >
      <CategoryIcon name={category.icon} size={Math.round(size * 0.45)} color={category.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '500' },
});
