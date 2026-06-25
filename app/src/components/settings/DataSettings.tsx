import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { exportCSV, exportJSON } from '@/lib/export';
import { clearReceipts } from '@/lib/receipts';
import type { PersistedData } from '@/types';

export function DataSettings() {
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  const snapshot = (): PersistedData => ({
    version: state.version,
    expenses: state.expenses,
    categories: state.categories,
    budgets: state.budgets,
    settings: state.settings,
  });

  const doClear = async () => {
    dispatch({ type: 'data/clear' });
    await clearReceipts();
    show('All data cleared.');
    setConfirmClear(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" size="lg" onClick={() => exportJSON(snapshot())}>
          <FileJson size={18} />
          Export JSON
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => exportCSV(state.expenses, state.categories)}
        >
          <FileSpreadsheet size={18} />
          Export CSV
        </Button>
      </div>

      <p className="flex items-start gap-1.5 px-1 text-xs text-muted">
        <Download size={13} className="mt-0.5 shrink-0" />
        Back up regularly — data lives only on this device and receipts aren't included in
        exports.
      </p>

      <Button variant="danger" size="lg" onClick={() => setConfirmClear(true)} className="mt-2">
        <Trash2 size={18} />
        Clear all data
      </Button>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all data?"
        message="This permanently deletes every expense, receipt, budget, and custom category on this device."
        confirmLabel="Delete everything"
        destructive
        onConfirm={doClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
