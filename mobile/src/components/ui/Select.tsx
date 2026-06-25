import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { Modal } from './Modal';
import { useTheme, radius } from '@/theme';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
}

export function Select({ value, options, onChange, placeholder = 'Select…', title }: SelectProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.trigger, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg }]}
      >
        <Text style={{ color: selected ? colors.ink : colors.muted, fontSize: 16 }}>
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color={colors.muted} />
      </Pressable>

      <Modal visible={open} onClose={() => setOpen(false)} title={title ?? 'Select'}>
        <View style={{ gap: 2 }}>
          {options.map((o) => {
            const active = o.value === value;
            return (
              <Pressable
                key={o.value}
                onPress={() => { onChange(o.value); setOpen(false); }}
                style={[styles.option, { backgroundColor: active ? colors.elevated : 'transparent' }]}
              >
                <Text style={{ color: colors.ink, fontSize: 16 }}>{o.label}</Text>
                {active && <Check size={18} color={colors.brand} />}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 46, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: radius.md,
  },
});
