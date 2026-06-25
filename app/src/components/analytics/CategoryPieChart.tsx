import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMoney } from '@/lib/currency';
import type { CategoryBreakdownItem } from '@/types';

interface CategoryPieChartProps {
  data: CategoryBreakdownItem[];
  currency: string;
}

/** Default export so it can be React.lazy-loaded. */
export default function CategoryPieChart({ data, currency }: CategoryPieChartProps) {
  const chartData = data.map((d) => ({
    name: d.category.name,
    value: d.total,
    color: d.category.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={90}
          paddingAngle={2}
          stroke="none"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [formatMoney(value, currency), name]}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid rgb(var(--border))',
            background: 'rgb(var(--elevated))',
            color: 'rgb(var(--ink))',
            fontSize: 13,
          }}
          itemStyle={{ color: 'rgb(var(--ink))' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
