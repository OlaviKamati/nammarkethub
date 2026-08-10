-- NamMarketHub v8 migration
-- Adds optional sale pricing on products (shop-entered, real numbers only —
-- shows as a "% off" badge when original_price is higher than the current price)
-- Run this in Supabase SQL Editor

alter table products add column if not exists original_price numeric(10,2);
