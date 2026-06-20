import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CategoryBadge } from '@/components/expense/CategoryPill';
import { CategoryEditor, type CategoryDraft } from './CategoryEditor';
import { OTHER_CATEGORY_ID } from '@/constants/categories';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { uid } from '@/lib/id';
import type { Category } from '@/types';

export function CategoryManager() {
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
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
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface divide-y divide-border">
        {state.categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-3 py-2.5">
            <CategoryBadge category={c} size={34} />
            <span className="flex-1 truncate text-sm font-medium text-ink">{c.name}</span>
            <button
              onClick={() => setEditing(c)}
              className="grid h-9 w-9 place-items-center rounded-lg text-muted no-tap-highlight active:bg-elevated"
              aria-label={`Edit ${c.name}`}
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setDeleting(c)}
              disabled={c.id === OTHER_CATEGORY_ID}
              className="grid h-9 w-9 place-items-center rounded-lg text-muted no-tap-highlight active:bg-elevated disabled:opacity-30"
              aria-label={`Delete ${c.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={() => setCreating(true)}>
        <Plus size={18} />
        New category
      </Button>

      <CategoryEditor open={creating} onClose={() => setCreating(false)} onSave={save} />
      <CategoryEditor
        open={Boolean(editing)}
        category={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSave={save}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete "${deleting?.name}"?`}
        message="Any expenses in this category will be moved to Other. This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
