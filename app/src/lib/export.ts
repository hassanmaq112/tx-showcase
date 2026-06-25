import { format } from 'date-fns';
import type { Category, Expense, PersistedData } from '@/types';

function download(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function stamp(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Export the full document (minus receipt blobs) as a JSON backup. */
export function exportJSON(data: PersistedData): void {
  download(JSON.stringify(data, null, 2), `expenses-${stamp()}.json`, 'application/json');
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Export expenses as CSV (date, category, amount, notes). Receipts excluded. */
export function exportCSV(expenses: Expense[], categories: Category[]): void {
  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const rows = [['date', 'category', 'amount', 'notes']];
  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  for (const e of sorted) {
    rows.push([
      e.date,
      nameById.get(e.categoryId) ?? 'Unknown',
      e.amount.toFixed(2),
      e.notes ?? '',
    ]);
  }
  const csv = rows.map((r) => r.map((c) => csvEscape(String(c))).join(',')).join('\n');
  download(csv, `expenses-${stamp()}.csv`, 'text/csv');
}
