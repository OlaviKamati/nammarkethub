-- NamMarketHub v9 migration
-- Paid featured placement on the homepage slideshow.
-- feature_requested: shop checked "I want this featured" when adding/editing a product —
--   this is just a request, it does NOT put them on the slideshow by itself.
-- is_featured: only YOU set this to true (in the Supabase Table Editor), after you've
--   actually arranged payment with the shop — same manual-approval pattern as is_verified.
-- Run this in Supabase SQL Editor

alter table products add column if not exists is_featured boolean not null default false;
alter table products add column if not exists feature_requested boolean not null default false;

-- Quick way to find pending requests later:
-- select id, name, shop_id, created_at from products where feature_requested = true and is_featured = false;
