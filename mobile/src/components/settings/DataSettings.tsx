import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Download, FileJson, FileSpreadsheet, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/useToast';
import { exportCSV, exportJSON } from '@/lib/export';
import { clearReceipts } from '@/lib/receipts';
import { useTheme } from '@/theme';
import type { PersistedData } from '@/types';

export function DataSettings() {
  const { state, dispatch } = useAppStore();
  const { show } = useToast();
  const { colors } = useTheme();
  const [confirmClear, setConfirmClear] = useState(false);

  const snapshot = (): PersistedData => ({
    version: state.version,
    expenses: state.expenses,
    categories: state.categories,
    budgets: state.budgets,
    settings: state.settings,
  });

  const doExport = async (fn: () => Promise<void>) => {
    try { await fn(); } catch { show('Export failed.', 'error'); }
  };

  const doClear = async () => {
    dispatch({ type: 'data/clear' });
    await clearReceipts();
    show('All data cleared.');
    setConfirmClear(false);
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.row}>
        <Button title="Export JSON" variant="secondary" size="lg" icon={<FileJson size={18} color={colors.ink} />}
          onPress={() => doExport(() => exportJSON(snapshot()))} style={{ flex: 1 }} />
        <Button title="Export CSV" variant="secondary" size="lg" icon={<FileSpreadsheet size={18} color={colors.ink} />}
          onPress={() => doExport(() => exportCSV(state.expenses, state.categories))} style={{ flex: 1 }} />
      </View>

      <View style={styles.note}>
        <Download size={13} color={colors.muted} />
        <Text style={[styles.noteText, { color: colors.muted }]}>
          Back up regularly. Exports don't include receipt images.
        </Text>
      </View>

      <Button title="Clear all data" variant="danger" size="lg" icon={<Trash2 size={18} color="#fff" />} onPress={() => setConfirmClear(true)} />

      <ConfirmDialog
        visible={confirmClear}
        title="Clear all data?"
        message="This permanently deletes every expense, receipt, budget, and custom category on this device."
        confirmLabel="Delete everything"
        destructive
        onConfirm={doClear}
        onCancel={() => setConfirmClear(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  note: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', paddingHorizontal: 4 },
  noteText: { fontSize: 12, flex: 1 },
});
