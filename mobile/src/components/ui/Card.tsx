import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme, radius } from '@/theme';

interface CardProps {
  children: ReactNode;
  title?: string;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, title, style, padded = true }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl, padding: padded ? 16 : 0 },
        style,
      ]}
    >
      {title ? <Text style={[styles.title, { color: colors.ink }]}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
});
