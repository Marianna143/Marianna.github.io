-- Memory board schema for /dnewnik-cork-7g4m
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  year integer not null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, year)
);

create table if not exists public.day_entries (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  date date not null,
  main_event text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(board_id, date)
);

create table if not exists public.sticker_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text not null default '📌',
  color text not null default '#f59e0b',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.stickers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text not null default '✨',
  image_path text,
  color text not null default '#f59e0b',
  category_id uuid references public.sticker_categories(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.entry_photos (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.day_entries(id) on delete cascade,
  storage_path text not null,
  taken_at timestamptz,
  display_date date not null,
  is_featured boolean not null default false,
  booth_group text,
  sort_order integer not null default 0,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.entry_stickers (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.day_entries(id) on delete cascade,
  sticker_id uuid not null references public.stickers(id) on delete cascade,
  x numeric,
  y numeric,
  rotation numeric,
  scale numeric,
  z_index integer,
  unique(entry_id, sticker_id)
);

create table if not exists public.cassettes (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  audio_path text not null,
  duration_sec integer,
  cover_path text,
  x numeric not null default 0,
  y numeric not null default 0,
  rotation numeric not null default 0,
  z_index integer not null default 200,
  created_at timestamptz not null default now()
);

create table if not exists public.board_layout_items (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  item_type text not null check (item_type in ('photo', 'sticker', 'cassette')),
  ref_id uuid not null,
  x numeric not null,
  y numeric not null,
  rotation numeric not null default 0,
  scale numeric not null default 1,
  z_index integer not null default 1,
  pinned boolean not null default true,
  updated_at timestamptz not null default now(),
  unique(board_id, item_type, ref_id)
);

create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  year integer not null,
  png_path text not null,
  pdf_path text not null,
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists boards_set_updated_at on public.boards;
create trigger boards_set_updated_at
before update on public.boards
for each row execute procedure public.set_updated_at();

drop trigger if exists day_entries_set_updated_at on public.day_entries;
create trigger day_entries_set_updated_at
before update on public.day_entries
for each row execute procedure public.set_updated_at();

drop trigger if exists board_layout_items_set_updated_at on public.board_layout_items;
create trigger board_layout_items_set_updated_at
before update on public.board_layout_items
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.day_entries enable row level security;
alter table public.entry_photos enable row level security;
alter table public.sticker_categories enable row level security;
alter table public.stickers enable row level security;
alter table public.entry_stickers enable row level security;
alter table public.cassettes enable row level security;
alter table public.board_layout_items enable row level security;
alter table public.exports enable row level security;

drop policy if exists "profiles_owner" on public.profiles;
create policy "profiles_owner" on public.profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "boards_owner" on public.boards;
create policy "boards_owner" on public.boards
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "day_entries_owner" on public.day_entries;
create policy "day_entries_owner" on public.day_entries
for all
using (
  exists (
    select 1 from public.boards b
    where b.id = day_entries.board_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.boards b
    where b.id = day_entries.board_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "entry_photos_owner" on public.entry_photos;
create policy "entry_photos_owner" on public.entry_photos
for all
using (
  exists (
    select 1
    from public.day_entries d
    join public.boards b on b.id = d.board_id
    where d.id = entry_photos.entry_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.day_entries d
    join public.boards b on b.id = d.board_id
    where d.id = entry_photos.entry_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "sticker_categories_owner" on public.sticker_categories;
create policy "sticker_categories_owner" on public.sticker_categories
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "stickers_owner" on public.stickers;
create policy "stickers_owner" on public.stickers
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "entry_stickers_owner" on public.entry_stickers;
create policy "entry_stickers_owner" on public.entry_stickers
for all
using (
  exists (
    select 1
    from public.day_entries d
    join public.boards b on b.id = d.board_id
    where d.id = entry_stickers.entry_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.day_entries d
    join public.boards b on b.id = d.board_id
    where d.id = entry_stickers.entry_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "cassettes_owner" on public.cassettes;
create policy "cassettes_owner" on public.cassettes
for all
using (
  exists (
    select 1 from public.boards b
    where b.id = cassettes.board_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.boards b
    where b.id = cassettes.board_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "layout_owner" on public.board_layout_items;
create policy "layout_owner" on public.board_layout_items
for all
using (
  exists (
    select 1 from public.boards b
    where b.id = board_layout_items.board_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.boards b
    where b.id = board_layout_items.board_id
      and b.user_id = auth.uid()
  )
);

drop policy if exists "exports_owner" on public.exports;
create policy "exports_owner" on public.exports
for all
using (
  exists (
    select 1 from public.boards b
    where b.id = exports.board_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.boards b
    where b.id = exports.board_id
      and b.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values
  ('memory-photos', 'memory-photos', true),
  ('memory-audio', 'memory-audio', true),
  ('memory-stickers', 'memory-stickers', true),
  ('memory-exports', 'memory-exports', true)
on conflict (id) do nothing;

drop policy if exists "memory photos select" on storage.objects;
create policy "memory photos select" on storage.objects
for select
using (bucket_id = 'memory-photos');

drop policy if exists "memory photos write own folder" on storage.objects;
create policy "memory photos write own folder" on storage.objects
for all
using (
  bucket_id = 'memory-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'memory-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "memory audio select" on storage.objects;
create policy "memory audio select" on storage.objects
for select
using (bucket_id = 'memory-audio');

drop policy if exists "memory audio write own folder" on storage.objects;
create policy "memory audio write own folder" on storage.objects
for all
using (
  bucket_id = 'memory-audio'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'memory-audio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "memory exports select" on storage.objects;
create policy "memory exports select" on storage.objects
for select
using (
  bucket_id = 'memory-exports'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "memory exports write own folder" on storage.objects;
create policy "memory exports write own folder" on storage.objects
for all
using (
  bucket_id = 'memory-exports'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'memory-exports'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "memory stickers select" on storage.objects;
create policy "memory stickers select" on storage.objects
for select
using (bucket_id = 'memory-stickers');

drop policy if exists "memory stickers write own folder" on storage.objects;
create policy "memory stickers write own folder" on storage.objects
for all
using (
  bucket_id = 'memory-stickers'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'memory-stickers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
