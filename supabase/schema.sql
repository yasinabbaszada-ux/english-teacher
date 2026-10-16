-- ============================================================
-- English Teacher — Supabase schema
-- Supabase Dashboard → SQL Editor → paste & run.
-- ============================================================

-- extensions (pgcrypto for gen_random_uuid is enabled by default on Supabase)

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_az text not null,
  name_en text not null,
  sort_order int not null default 0
);

-- ---------- materials ----------
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title_az text not null,
  title_en text not null,
  description_az text,
  description_en text,
  category_id uuid references public.categories(id) on delete set null,
  is_paid boolean not null default false,
  price numeric,
  file_path text,
  thumbnail_path text,
  preview_text_az text,
  preview_text_en text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- access_codes ----------
create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  material_id uuid references public.materials(id) on delete cascade,
  max_uses int not null default 1,
  used_count int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  note text,
  created_at timestamptz not null default now()
);

-- ---------- redemptions ----------
create table if not exists public.redemptions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid references public.access_codes(id) on delete cascade,
  material_id uuid references public.materials(id) on delete cascade,
  redeemed_at timestamptz not null default now()
);

-- ---------- site_settings (single row, id = 1) ----------
create table if not exists public.site_settings (
  id int primary key default 1,
  phone text,
  whatsapp text,
  email text,
  instagram text,
  telegram text,
  hero_title_az text,
  hero_title_en text,
  hero_subtitle_az text,
  hero_subtitle_en text,
  about_az text,
  about_en text,
  years_experience int,
  students_count int,
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1)
  on conflict (id) do nothing;

-- ============================================================
-- Row Level Security
-- Server uses the SERVICE ROLE key (bypasses RLS) for admin
-- writes and for reads that must stay private (files/codes).
-- The policies below only grant the PUBLIC (anon) role safe reads.
-- ============================================================

alter table public.categories     enable row level security;
alter table public.materials      enable row level security;
alter table public.access_codes   enable row level security;
alter table public.redemptions    enable row level security;
alter table public.site_settings  enable row level security;

-- Public may read categories, published materials and settings.
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select to anon using (true);

drop policy if exists "public read published materials" on public.materials;
create policy "public read published materials" on public.materials
  for select to anon using (published = true);

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select to anon using (true);

-- access_codes and redemptions: NO anon policy → not readable by public.
-- (Only the service role, used server-side, can touch them.)

-- ============================================================
-- Storage: private bucket "materials" (files + thumbnails).
-- Files are served only via short-lived signed URLs from the server.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

-- No public storage policies: the anon key cannot list or download.
-- The server (service role) creates signed URLs on demand.
