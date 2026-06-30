-- NamMarketHub v2 migration
-- Run this in Supabase SQL Editor (it's safe to run on existing data)

-- ============================================================
-- 1. Add shop_type to shops table
-- ============================================================
alter table shops
  add column if not exists shop_type text default 'electronics'
  check (shop_type in ('electronics', 'fashion', 'food', 'furniture', 'general'));

-- ============================================================
-- 2. Expand categories to cover all shop types
-- ============================================================
-- Clear existing categories and replace with full set
delete from categories;

insert into categories (id, label) values
  -- Electronics
  ('phones',        'Phones'),
  ('laptops',       'Laptops'),
  ('audio',         'Audio'),
  ('accessories',   'Accessories'),
  ('gaming',        'Gaming'),
  ('cameras',       'Cameras'),
  -- Fashion
  ('mens',          'Men''s Clothing'),
  ('womens',        'Women''s Clothing'),
  ('shoes',         'Shoes'),
  ('bags',          'Bags & Accessories'),
  ('kids_fashion',  'Kids Fashion'),
  -- Food
  ('groceries',     'Groceries'),
  ('beverages',     'Beverages'),
  ('snacks',        'Snacks'),
  ('fresh',         'Fresh Produce'),
  ('packaged',      'Packaged Food'),
  -- Furniture
  ('living_room',   'Living Room'),
  ('bedroom',       'Bedroom'),
  ('office',        'Office Furniture'),
  ('outdoor',       'Outdoor'),
  ('kitchen',       'Kitchen & Dining'),
  -- General
  ('general',       'General');
