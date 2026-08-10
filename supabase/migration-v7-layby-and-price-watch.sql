-- NamMarketHub v7 migration
-- Adds opt-in payment-plan tracking on orders (shop enters real amounts as they're paid —
-- nothing here is fabricated, it's just a place to record what already happens over WhatsApp/cash)
-- and price-at-save tracking on wishlist items (so "price dropped" is a real comparison).
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. Payment plan tracking on orders
-- ============================================================
-- null = regular order (no payment plan requested).
-- non-null = buyer asked to pay in instalments; shop updates this as deposits/instalments come in.
alter table orders add column if not exists deposit_paid numeric(10,2);

-- ============================================================
-- 2. Price-at-save tracking on wishlist
-- ============================================================
alter table wishlist_items add column if not exists price_at_add numeric(10,2);
