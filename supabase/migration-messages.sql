-- ============================================================
-- Migration: contact form messages
-- Supabase Dashboard → SQL Editor → paste & run.
-- ============================================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact text,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- No anon policies: the public cannot read or write directly.
-- The server (service role) inserts via /api/contact and the admin reads them.
