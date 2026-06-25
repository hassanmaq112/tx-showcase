import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Input } from './Input';
import { parseDay } from '@/lib/dates';
import { useTheme, radius } from '@/theme';

interface DatePickerFieldProps {
  value: string; // yyyy-MM-dd
  onChange: (value: string) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

  if (Platform.OS === 'web') {
    // Native date input on web; plain text fallback elsewhere via the picker below.
    return <Input value={value} onChangeText={onChange} placeholder="yyyy-mm-dd" />;
  }

  const date = parseDay(value);
  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}
      >
        <Text style={{ color: colors.ink, fontSize: 16 }}>{format(date, 'EEE, MMM d, yyyy')}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selected) => {
            if (Platform.OS === 'android') setShow(false);
            if (event.type === 'set' && selected) onChange(format(selected, 'yyyy-MM-dd'));
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: { height: 46, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, justifyContent: 'center' },
});
