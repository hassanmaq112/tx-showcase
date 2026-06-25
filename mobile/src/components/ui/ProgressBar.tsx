import { View } from 'react-native';
import { useTheme, levelColor } from '@/theme';
import type { BudgetLevel } from '@/types';

interface ProgressBarProps {
  ratio: number;
  level?: BudgetLevel;
  height?: number;
}

export function ProgressBar({ ratio, level = 'none', height = 10 }: ProgressBarProps) {
  const { colors } = useTheme();
  const width = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: colors.border, overflow: 'hidden' }}>
      <View
        style={{ height: '100%', width: `${width}%`, borderRadius: height / 2, backgroundColor: levelColor(level, colors) }}
      />
    </View>
  );
}
