import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme, radius, type Palette } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
const FONT: Record<Size, number> = { sm: 14, md: 15, lg: 16 };

function bg(variant: Variant, c: Palette): string {
  switch (variant) {
    case 'primary': return c.brand;
    case 'danger': return c.danger;
    case 'secondary': return c.elevated;
    default: return 'transparent';
  }
}
function fg(variant: Variant, c: Palette): string {
  switch (variant) {
    case 'primary': return c.brandInk;
    case 'danger': return '#ffffff';
    default: return c.ink;
  }
}

export function Button({
  title, onPress, variant = 'primary', size = 'md', fullWidth, disabled, loading, icon, style, testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const color = fg(variant, colors);
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: size === 'sm' ? 12 : 18,
          backgroundColor: bg(variant, colors),
          borderRadius: radius.lg,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
        },
        fullWidth && { alignSelf: 'stretch' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.row}>
          {icon}
          {title ? <Text style={{ color, fontWeight: '600', fontSize: FONT[size] }}>{title}</Text> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
