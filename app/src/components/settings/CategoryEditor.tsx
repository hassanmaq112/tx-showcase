import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/constants/categories';
import { cn } from '@/lib/cn';
import type { Category } from '@/types';

export interface CategoryDraft {
  name: string;
  icon: string;
  color: string;
}

interface CategoryEditorProps {
  open: boolean;
  /** Provide to edit an existing category; omit to create a new one. */
  category?: Category;
  onClose: () => void;
  onSave: (draft: CategoryDraft) => void;
}

export function CategoryEditor({ open, category, onClose, onSave }: CategoryEditorProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0]);
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);

  // Reset draft whenever the modal opens for a different target.
  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? '');
    setIcon(category?.icon ?? CATEGORY_ICONS[0]);
    setColor(category?.color ?? CATEGORY_COLORS[0]);
  }, [open, category]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, icon, color });
  };

  return (
    <Modal open={open} onClose={onClose} title={category ? 'Edit category' : 'New category'}>
      <div className="mt-2 flex flex-col gap-4">
        <Field label="Name" htmlFor="cat-name">
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Groceries"
            autoFocus
            maxLength={24}
          />
        </Field>

        <Field label="Icon">
          <div className="grid grid-cols-6 gap-2">
            {CATEGORY_ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={cn(
                  'grid aspect-square place-items-center rounded-xl border no-tap-highlight',
                  icon === ic ? 'border-brand bg-brand/10 text-brand' : 'border-border text-muted',
                )}
                aria-label={ic}
              >
                <CategoryIcon name={ic} size={18} />
              </button>
            ))}
          </div>
        </Field>

        <Field label="Color">
          <div className="grid grid-cols-6 gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  'aspect-square rounded-full no-tap-highlight ring-2 ring-offset-2 ring-offset-canvas',
                  color === c ? 'ring-ink' : 'ring-transparent',
                )}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </Field>

        <Button fullWidth size="lg" onClick={submit} disabled={!name.trim()}>
          {category ? 'Save changes' : 'Add category'}
        </Button>
      </div>
    </Modal>
  );
}
