-- NamMarketHub v6 migration
-- Adds user profiles (username, display name, avatar) for any authenticated account
-- Run this in Supabase SQL Editor

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;

create policy "Public can view profiles" on profiles for select using (true);
create policy "Users can create their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
