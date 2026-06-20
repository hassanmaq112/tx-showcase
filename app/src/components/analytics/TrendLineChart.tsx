import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatMoney, formatMoneyCompact } from '@/lib/currency';
import type { TrendPoint } from '@/types';

interface TrendLineChartProps {
  data: TrendPoint[];
  currency: string;
  /** Resolved brand color (CSS vars aren't readable by SVG fill directly). */
  color: string;
}

/** Default export so it can be React.lazy-loaded. */
export default function TrendLineChart({ data, currency, color }: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v: number) => formatMoneyCompact(v, currency)}
        />
        <Tooltip
          formatter={(value: number) => [formatMoney(value, currency), 'Spent']}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid rgb(var(--border))',
            background: 'rgb(var(--elevated))',
            color: 'rgb(var(--ink))',
            fontSize: 13,
          }}
          labelStyle={{ color: 'rgb(var(--muted))' }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke={color}
          strokeWidth={2.5}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
