import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme, radius } from '@/theme';

interface InputProps extends TextInputProps {
  prefix?: string;
  invalid?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { prefix, invalid, style, ...props },
  ref,
) {
  const { colors } = useTheme();
  const border = invalid ? colors.danger : colors.border;
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.surface, borderColor: border, borderRadius: radius.lg },
      ]}
    >
      {prefix ? <Text style={[styles.prefix, { color: colors.muted }]}>{prefix}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.ink }, style]}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', height: 46, borderWidth: StyleSheet.hairlineWidth },
  prefix: { paddingLeft: 12, fontSize: 16 },
  input: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 16 },
});
