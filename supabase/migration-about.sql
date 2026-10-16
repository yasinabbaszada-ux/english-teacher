-- ============================================================
-- Migration: teacher photo + certificates (admin-managed)
-- Supabase Dashboard → SQL Editor → paste & run.
-- ============================================================

-- teacher photo stored on the single settings row
alter table public.site_settings
  add column if not exists photo_path text;

-- certificates (shown on the About page)
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "public read certificates" on public.certificates;
create policy "public read certificates" on public.certificates
  for select to anon using (true);

-- public bucket for non-sensitive images (photo, certificates, thumbnails)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- allow anyone to read objects in the public "media" bucket
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select to anon using (bucket_id = 'media');
