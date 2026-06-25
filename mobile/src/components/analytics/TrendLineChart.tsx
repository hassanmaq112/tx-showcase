import { useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { formatMoneyCompact } from '@/lib/currency';
import { useTheme } from '@/theme';
import type { TrendPoint } from '@/types';

/** 12-month spending area/line chart. Measures its own width for responsiveness. */
export function TrendLineChart({ data, currency }: { data: TrendPoint[]; currency: string }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  const maxVal = Math.max(1, ...data.map((d) => d.total));
  const chartData = data.map((d, i) => ({
    value: d.total,
    // Label every other month to avoid crowding 12 ticks.
    label: i % 2 === 0 ? d.label : '',
  }));

  // Account for y-axis label width + container padding.
  const spacing = width > 0 ? Math.max(18, (width - 56) / Math.max(1, data.length)) : 26;

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ overflow: 'hidden' }}>
      {width > 0 && (
        <LineChart
          data={chartData}
          width={width - 8}
          height={200}
          areaChart
          curved
          color={colors.brand}
          thickness={2.5}
          startFillColor={colors.brand}
          endFillColor={colors.surface}
          startOpacity={0.3}
          endOpacity={0.02}
          hideDataPoints
          spacing={spacing}
          initialSpacing={12}
          endSpacing={8}
          noOfSections={4}
          maxValue={Math.ceil(maxVal * 1.15)}
          yAxisThickness={0}
          xAxisThickness={0}
          rulesColor={colors.border}
          yAxisTextStyle={{ color: colors.muted, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.muted, fontSize: 10 }}
          formatYLabel={(v: string) => formatMoneyCompact(Number(v), currency)}
        />
      )}
    </View>
  );
}
