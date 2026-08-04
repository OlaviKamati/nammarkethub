-- NamMarketHub v5 migration
-- Adds buyer identity + cart batching on orders, plus reviews, wishlist, newsletter
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. Buyer identity + cart batching on orders
-- ============================================================
alter table orders add column if not exists buyer_id uuid references auth.users(id) on delete set null;
alter table orders add column if not exists group_id uuid;
create index if not exists idx_orders_buyer on orders(buyer_id);
create index if not exists idx_orders_group on orders(group_id) where group_id is not null;

create policy "Buyers can view their own orders" on orders
  for select using (auth.uid() = buyer_id);

-- ============================================================
-- 2. Reviews
-- ============================================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  buyer_id uuid references auth.users(id) on delete cascade not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (product_id, buyer_id)
);
alter table reviews enable row level security;
create policy "Public can view reviews" on reviews for select using (true);
create policy "Buyers can insert their own review" on reviews for insert with check (auth.uid() = buyer_id);
create policy "Buyers can update their own review" on reviews for update using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);
create policy "Buyers can delete their own review" on reviews for delete using (auth.uid() = buyer_id);
create index idx_reviews_product on reviews(product_id);

-- ============================================================
-- 3. Wishlist
-- ============================================================
create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (buyer_id, product_id)
);
alter table wishlist_items enable row level security;
create policy "Buyers manage their own wishlist" on wishlist_items
  for all using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);

-- ============================================================
-- 4. Newsletter signups (public insert, no read policy = default-deny select)
-- ============================================================
create table newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);
alter table newsletter_signups enable row level security;
create policy "Anyone can subscribe" on newsletter_signups for insert with check (true);
