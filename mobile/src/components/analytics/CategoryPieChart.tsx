import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTheme } from '@/theme';
import type { CategoryBreakdownItem } from '@/types';

/** Donut chart of category spend. */
export function CategoryPieChart({ data }: { data: CategoryBreakdownItem[] }) {
  const { colors } = useTheme();
  const chartData = data
    .filter((d) => d.total > 0)
    .map((d) => ({ value: d.total, color: d.category.color }));

  if (chartData.length === 0) return null;

  return (
    <View style={{ alignItems: 'center', paddingVertical: 8 }}>
      <PieChart
        data={chartData}
        donut
        radius={92}
        innerRadius={58}
        innerCircleColor={colors.surface}
      />
    </View>
  );
}
