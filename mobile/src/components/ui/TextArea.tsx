import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { useTheme, radius } from '@/theme';

export function TextArea({ style, ...props }: TextInputProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      multiline
      placeholderTextColor={colors.muted}
      style={[
        styles.area,
        { backgroundColor: colors.surface, borderColor: colors.border, color: colors.ink, borderRadius: radius.lg },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  area: { minHeight: 80, borderWidth: StyleSheet.hairlineWidth, padding: 12, fontSize: 16, textAlignVertical: 'top' },
});
