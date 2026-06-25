# Supabase setup (Expense Tracker)

The app runs **fully local-first without a backend**. Adding Supabase enables
accounts, cross-device sync, and cloud receipt storage. Do these one-time steps,
then drop your keys into `mobile/.env`.

## 1. Create a project
- Go to https://supabase.com/dashboard → **New project**.
- Note the **Project URL** and **anon public key** (Project Settings → API).
  The **service-role** key is secret — never put it in this app or the repo.

## 2. Run the schema
- Dashboard → **SQL Editor** → paste the contents of
  [`migrations/0001_init.sql`](./migrations/0001_init.sql) → **Run**.
- This creates the `expenses`, `categories`, `category_budgets`, `user_settings`
  tables with **Row Level Security** (each user sees only their own rows), and a
  private **`receipts`** Storage bucket with owner-only policies.

  (Or with the Supabase CLI: `supabase db push`.)

## 3. Enable email auth
- Dashboard → **Authentication → Providers → Email** → enable.
- For frictionless development you can turn **off** "Confirm email"
  (Authentication → Providers → Email → Confirm email), so email+password works
  without an inbox round-trip. Turn it back on for production.

## 4. Add your keys to the app
```bash
cd mobile
cp .env.example .env
# edit .env and set:
#   EXPO_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
#   EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```
Restart the dev server (`npx expo start -c`). The app will now show a sign-in
screen and sync. Without `.env`, it silently stays in local-only mode.

## How sync works
- **Local-first:** the on-device cache (AsyncStorage + receipt files) is the
  source of truth the UI reads, so everything is instant and works offline.
- On sign-in the app pulls remote data and merges it (last-write-wins on
  `updatedAt`); local edits reconcile up to Postgres (debounced), draining a
  queue when connectivity returns; deletes propagate via `deleted_at` tombstones.
- Receipts upload to the private `receipts` bucket at `<userId>/<receiptId>.jpg`
  and download on demand (signed URLs) with a local cache.
- Realtime keeps multiple devices in sync.
