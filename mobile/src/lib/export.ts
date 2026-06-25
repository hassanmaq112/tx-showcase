import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { Category, Expense, PersistedData } from '@/types';

function stamp(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

async function shareString(content: string, filename: string, mimeType: string, uti: string) {
  const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!dir) throw new Error('No writable directory available');
  const uri = dir + filename;
  await FileSystem.writeAsStringAsync(uri, content);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType, UTI: uti, dialogTitle: filename });
  }
}

/** Export the full document (minus receipt images) as a JSON backup. */
export async function exportJSON(data: PersistedData): Promise<void> {
  await shareString(
    JSON.stringify(data, null, 2),
    `expenses-${stamp()}.json`,
    'application/json',
    'public.json',
  );
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Export expenses as CSV (date, category, amount, notes). Receipts excluded. */
export async function exportCSV(expenses: Expense[], categories: Category[]): Promise<void> {
  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const rows = [['date', 'category', 'amount', 'notes']];
  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  for (const e of sorted) {
    rows.push([e.date, nameById.get(e.categoryId) ?? 'Unknown', e.amount.toFixed(2), e.notes ?? '']);
  }
  const csv = rows.map((r) => r.map((c) => csvEscape(String(c))).join(',')).join('\n');
  await shareString(csv, `expenses-${stamp()}.csv`, 'text/csv', 'public.comma-separated-values-text');
}
