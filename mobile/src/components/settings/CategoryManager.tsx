import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CategoryBadge } from '@/components/expense/CategoryPill';
import { CategoryEditor, type CategoryDraft } from './CategoryEditor';
import { OTHER_CATEGORY_ID } from '@/constants/categories';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/lib/id';
import { useTheme, radius } from '@/theme';
import type { Category } from '@/types';

export function CategoryManager() {
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
  const { colors } = useTheme();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const save = (draft: CategoryDraft) => {
    if (editing) {
      dispatch({ type: 'category/update', id: editing.id, patch: draft });
      show('Category updated.');
      setEditing(null);
    } else {
      dispatch({ type: 'category/add', category: { id: uid(), ...draft } });
      show('Category added.');
      setCreating(false);
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    dispatch({ type: 'category/delete', id: deleting.id, reassignToId: OTHER_CATEGORY_ID });
    show('Category deleted; expenses moved to Other.');
    setDeleting(null);
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.xl }]}>
        {state.categories.map((c, i) => (
          <View key={c.id} style={[styles.row, i < state.categories.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <CategoryBadge category={c} size={34} />
            <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>{c.name}</Text>
            <Pressable onPress={() => setEditing(c)} hitSlop={8} style={styles.iconBtn}>
              <Pencil size={16} color={colors.muted} />
            </Pressable>
            <Pressable
              onPress={() => setDeleting(c)}
              disabled={c.id === OTHER_CATEGORY_ID}
              hitSlop={8}
              style={[styles.iconBtn, c.id === OTHER_CATEGORY_ID && { opacity: 0.3 }]}
            >
              <Trash2 size={16} color={colors.muted} />
            </Pressable>
          </View>
        ))}
      </View>

      <Button title="New category" variant="secondary" icon={<Plus size={18} color={colors.ink} />} onPress={() => setCreating(true)} />

      <CategoryEditor visible={creating} onClose={() => setCreating(false)} onSave={save} />
      <CategoryEditor visible={Boolean(editing)} category={editing ?? undefined} onClose={() => setEditing(null)} onSave={save} />
      <ConfirmDialog
        visible={Boolean(deleting)}
        title={`Delete "${deleting?.name}"?`}
        message="Any expenses in this category will be moved to Other. This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  name: { flex: 1, fontSize: 15, fontWeight: '500' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
