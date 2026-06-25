import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/categories';
import { useTheme, radius, withAlpha } from '@/theme';
import type { Category } from '@/types';

export interface CategoryDraft {
  name: string;
  icon: string;
  color: string;
}

interface CategoryEditorProps {
  visible: boolean;
  category?: Category;
  onClose: () => void;
  onSave: (draft: CategoryDraft) => void;
}

export function CategoryEditor({ visible, category, onClose, onSave }: CategoryEditorProps) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0]);
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);

  useEffect(() => {
    if (!visible) return;
    setName(category?.name ?? '');
    setIcon(category?.icon ?? CATEGORY_ICONS[0]);
    setColor(category?.color ?? CATEGORY_COLORS[0]);
  }, [visible, category]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, icon, color });
  };

  return (
    <Modal visible={visible} onClose={onClose} title={category ? 'Edit category' : 'New category'}>
      <View style={{ gap: 16, paddingTop: 4 }}>
        <Field label="Name">
          <Input value={name} onChangeText={setName} placeholder="e.g. Groceries" autoFocus maxLength={24} />
        </Field>

        <Field label="Icon">
          <View style={styles.grid}>
            {CATEGORY_ICONS.map((ic) => {
              const active = ic === icon;
              return (
                <Pressable
                  key={ic}
                  onPress={() => setIcon(ic)}
                  style={[styles.cell, { borderColor: active ? colors.brand : colors.border, backgroundColor: active ? withAlpha(colors.brand, 0.1) : 'transparent' }]}
                >
                  <CategoryIcon name={ic} size={18} color={active ? colors.brand : colors.muted} />
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="Color">
          <View style={styles.grid}>
            {CATEGORY_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[styles.swatch, { backgroundColor: c, borderColor: color === c ? colors.ink : 'transparent' }]}
              />
            ))}
          </View>
        </Field>

        <Button title={category ? 'Save changes' : 'Add category'} size="lg" fullWidth onPress={submit} disabled={!name.trim()} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: { width: 46, height: 46, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 3 },
});
