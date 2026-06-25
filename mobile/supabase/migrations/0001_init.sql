-- Expense Tracker — initial schema, RLS, and Storage policies.
-- Run in the Supabase SQL editor (or `supabase db push`). Safe to re-run.

-- ---------- Tables ----------
create table if not exists public.categories (
  id          text not null,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  icon        text not null,
  color       text not null,
  is_custom   boolean not null default true,
  updated_at  timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.expenses (
  id           text not null,
  user_id      uuid not null references auth.users(id) on delete cascade,
  date         date not null,
  category_id  text not null,
  amount       numeric(12,2) not null,
  notes        text,
  receipt_path text,                       -- '<userId>/<receiptId>.jpg' or null
  created_at   bigint not null,            -- epoch ms (matches the client)
  updated_at   bigint not null,            -- epoch ms — last-write-wins key
  deleted_at   bigint,                     -- soft-delete tombstone (null = live)
  primary key (user_id, id)
);
create index if not exists expenses_user_date_idx on public.expenses (user_id, date);

create table if not exists public.category_budgets (
  user_id       uuid not null references auth.users(id) on delete cascade,
  category_id   text not null,
  monthly_limit numeric(12,2) not null,
  updated_at    timestamptz not null default now(),
  primary key (user_id, category_id)
);

create table if not exists public.user_settings (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  currency       text not null default 'USD',
  warn_threshold numeric(4,3) not null default 0.9,
  global_monthly numeric(12,2),            -- null = no global budget
  version        int not null default 1,
  updated_at     bigint not null default 0 -- epoch ms — LWW key
);

-- ---------- Row Level Security (owner-only) ----------
alter table public.categories       enable row level security;
alter table public.expenses         enable row level security;
alter table public.category_budgets enable row level security;
alter table public.user_settings    enable row level security;

drop policy if exists "own rows" on public.categories;
create policy "own rows" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.expenses;
create policy "own rows" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.category_budgets;
create policy "own rows" on public.category_budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rows" on public.user_settings;
create policy "own rows" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Storage bucket + policies (receipts) ----------
-- Create a PRIVATE bucket named 'receipts' (idempotent).
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- Owner-only access, scoped to the user's own folder (path '<userId>/...').
drop policy if exists "own receipts read" on storage.objects;
create policy "own receipts read" on storage.objects for select
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own receipts write" on storage.objects;
create policy "own receipts write" on storage.objects for insert
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own receipts update" on storage.objects;
create policy "own receipts update" on storage.objects for update
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own receipts delete" on storage.objects;
create policy "own receipts delete" on storage.objects for delete
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
