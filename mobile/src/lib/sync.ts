import { supabase } from './supabase';
import { defaultData } from './storage';
import { uploadReceipt, removeRemoteReceipt } from './receiptsRemote';
import type { Budgets, Category, Expense, PersistedData, Settings } from '@/types';

// Local-first sync against Supabase. The local AsyncStorage document remains the
// source of truth the UI reads; this layer reconciles it with Postgres using
// last-write-wins on `updatedAt`, with soft-delete tombstones for expenses.

// ---------- row mappers ----------
interface ExpenseRow {
  id: string; user_id: string; date: string; category_id: string; amount: number;
  notes: string | null; receipt_path: string | null; created_at: number; updated_at: number; deleted_at: number | null;
}
interface CategoryRow {
  id: string; user_id: string; name: string; icon: string; color: string; is_custom: boolean; updated_at: string;
}
interface BudgetRow { user_id: string; category_id: string; monthly_limit: number }
interface SettingsRow {
  user_id: string; currency: string; warn_threshold: number; global_monthly: number | null; version: number; updated_at: number;
}

const receiptIdFromPath = (path: string | null): string | undefined =>
  path ? path.split('/').pop()?.replace(/\.jpg$/, '') : undefined;

function rowToExpense(r: ExpenseRow): Expense {
  return {
    id: r.id, date: r.date, categoryId: r.category_id, amount: Number(r.amount),
    notes: r.notes ?? undefined, receiptId: receiptIdFromPath(r.receipt_path),
    createdAt: Number(r.created_at), updatedAt: Number(r.updated_at),
  };
}
function expenseToRow(userId: string, e: Expense): ExpenseRow {
  return {
    id: e.id, user_id: userId, date: e.date, category_id: e.categoryId, amount: e.amount,
    notes: e.notes ?? null, receipt_path: e.receiptId ? `${userId}/${e.receiptId}.jpg` : null,
    created_at: e.createdAt, updated_at: e.updatedAt, deleted_at: null,
  };
}

// ---------- pull ----------
export async function pullRemote(userId: string): Promise<PersistedData | null> {
  if (!supabase) return null;
  const [cats, exps, cbuds, sett] = await Promise.all([
    supabase.from('categories').select('*').eq('user_id', userId),
    supabase.from('expenses').select('*').eq('user_id', userId).is('deleted_at', null),
    supabase.from('category_budgets').select('*').eq('user_id', userId),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
  ]);
  if (cats.error || exps.error || cbuds.error) return null;

  const base = defaultData();
  const categories: Category[] = (cats.data as CategoryRow[] | null)?.length
    ? (cats.data as CategoryRow[]).map((c) => ({ id: c.id, name: c.name, icon: c.icon, color: c.color, isCustom: c.is_custom }))
    : base.categories;
  const expenses = (exps.data as ExpenseRow[] | null ?? []).map(rowToExpense);
  const settingsRow = sett.data as SettingsRow | null;
  const budgets: Budgets = {
    globalMonthly: settingsRow?.global_monthly ?? null,
    perCategory: (cbuds.data as BudgetRow[] | null ?? []).map((b) => ({ categoryId: b.category_id, monthlyLimit: Number(b.monthly_limit) })),
  };
  const settings: Settings = {
    currency: settingsRow?.currency ?? base.settings.currency,
    warnThreshold: settingsRow?.warn_threshold ?? base.settings.warnThreshold,
  };
  return { version: settingsRow?.version ?? base.version, expenses, categories, budgets, settings, hasRemoteSettings: Boolean(settingsRow) } as PersistedData & { hasRemoteSettings: boolean };
}

// ---------- merge (LWW) ----------
export function mergeRemote(local: PersistedData, remote: PersistedData & { hasRemoteSettings?: boolean }): PersistedData {
  // Expenses: union by id, newest updatedAt wins.
  const byId = new Map<string, Expense>();
  for (const e of local.expenses) byId.set(e.id, e);
  for (const e of remote.expenses) {
    const cur = byId.get(e.id);
    if (!cur || e.updatedAt >= cur.updatedAt) byId.set(e.id, e);
  }
  // Categories: union by id, remote wins on conflict (carries server edits).
  const cats = new Map<string, Category>();
  for (const c of local.categories) cats.set(c.id, c);
  for (const c of remote.categories) cats.set(c.id, c);

  // Settings/budgets: prefer remote only when the server actually has a settings row.
  const useRemoteSettings = remote.hasRemoteSettings;
  return {
    version: Math.max(local.version, remote.version),
    expenses: [...byId.values()],
    categories: [...cats.values()],
    budgets: useRemoteSettings ? remote.budgets : local.budgets,
    settings: useRemoteSettings ? remote.settings : local.settings,
  };
}

// ---------- reconcile push ----------
/** Push the full local document to Supabase (idempotent): upsert all rows,
 *  tombstone expenses removed locally, upload missing receipts. */
export async function pushReconcile(userId: string, data: PersistedData): Promise<void> {
  if (!supabase) return;

  // Categories: upsert all local.
  await supabase.from('categories').upsert(
    data.categories.map((c) => ({ id: c.id, user_id: userId, name: c.name, icon: c.icon, color: c.color, is_custom: c.isCustom, updated_at: new Date().toISOString() })),
  );

  // Expenses: fetch remote state to decide receipt uploads + tombstones.
  const remote = await supabase.from('expenses').select('id, receipt_path, deleted_at').eq('user_id', userId);
  const remoteRows = (remote.data as { id: string; receipt_path: string | null; deleted_at: number | null }[] | null) ?? [];
  const localIds = new Set(data.expenses.map((e) => e.id));

  await supabase.from('expenses').upsert(data.expenses.map((e) => expenseToRow(userId, e)));

  // Upload receipts that exist locally but aren't in storage yet.
  for (const e of data.expenses) {
    if (!e.receiptId) continue;
    const r = remoteRows.find((x) => x.id === e.id);
    if (!r || !r.receipt_path) await uploadReceipt(userId, e.receiptId).catch(() => {});
  }

  // Tombstone expenses deleted locally (present remote-live, absent local).
  const toTombstone = remoteRows.filter((r) => !localIds.has(r.id) && r.deleted_at == null);
  if (toTombstone.length) {
    const ts = Date.now();
    await supabase.from('expenses').update({ deleted_at: ts, updated_at: ts }).eq('user_id', userId).in('id', toTombstone.map((r) => r.id));
    for (const r of toTombstone) {
      const rid = receiptIdFromPath(r.receipt_path);
      if (rid) await removeRemoteReceipt(userId, rid).catch(() => {});
    }
  }

  // Category budgets: replace the set.
  await supabase.from('category_budgets').delete().eq('user_id', userId);
  if (data.budgets.perCategory.length) {
    await supabase.from('category_budgets').upsert(
      data.budgets.perCategory.map((b) => ({ user_id: userId, category_id: b.categoryId, monthly_limit: b.monthlyLimit, updated_at: new Date().toISOString() })),
    );
  }

  // Settings (single row).
  await supabase.from('user_settings').upsert({
    user_id: userId,
    currency: data.settings.currency,
    warn_threshold: data.settings.warnThreshold,
    global_monthly: data.budgets.globalMonthly,
    version: data.version,
    updated_at: Date.now(),
  });
}

/** Subscribe to remote changes for multi-device sync. Returns an unsubscribe fn. */
export function subscribeRealtime(userId: string, onChange: () => void): () => void {
  const client = supabase;
  if (!client) return () => {};
  const channel = client
    .channel('etx-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${userId}` }, onChange)
    .subscribe();
  return () => { void client.removeChannel(channel); };
}
