-- NamMarketHub database schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

-- ============================================================
-- SHOPS
-- ============================================================
create table shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  location text not null,            -- e.g. "Windhoek", "Swakopmund"
  whatsapp_number text,              -- for the "contact seller" MVP flow
  logo_url text,
  is_verified boolean default false, -- you manually verify shops at first
  created_at timestamptz default now()
);

-- ============================================================
-- CATEGORIES (fixed list for v1 — electronics focus)
-- ============================================================
create table categories (
  id text primary key,               -- e.g. 'phones', 'laptops', 'audio', 'access'
  label text not null
);

insert into categories (id, label) values
  ('phones', 'Phones'),
  ('laptops', 'Laptops'),
  ('audio', 'Audio'),
  ('access', 'Accessories');

-- ============================================================
-- PRODUCTS
-- ============================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  category_id text references categories(id) not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  stock_count int default 1 check (stock_count >= 0),
  photo_url text,
  is_active boolean default true,    -- soft-hide instead of delete
  created_at timestamptz default now()
);

-- ============================================================
-- ORDERS (v1: just records intent to buy, contact happens via WhatsApp)
-- ============================================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  buyer_name text not null,
  buyer_contact text not null,       -- phone or email
  quantity int default 1 check (quantity >= 1),
  status text default 'pending' check (status in ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table shops enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Anyone can view shops and active products (public marketplace)
create policy "Public can view shops" on shops for select using (true);
create policy "Public can view active products" on products for select using (is_active = true);

-- Shop owners can manage only their own shop and products
create policy "Owners manage their shop" on shops for all using (auth.uid() = owner_id);
create policy "Owners manage their products" on products
  for all using (shop_id in (select id from shops where owner_id = auth.uid()));

-- Anyone can place an order (no login required for v1 buyers)
create policy "Anyone can create an order" on orders for insert with check (true);
create policy "Shop owners can view orders for their products" on orders
  for select using (
    product_id in (
      select p.id from products p
      join shops s on s.id = p.shop_id
      where s.owner_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES for common queries
-- ============================================================
create index idx_products_shop on products(shop_id);
create index idx_products_category on products(category_id);
create index idx_orders_product on orders(product_id);
