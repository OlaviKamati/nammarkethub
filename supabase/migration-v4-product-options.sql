-- NamMarketHub v4 migration
-- Adds flexible product option groups (e.g. Color, Size, Flavour/Variety)
-- Run this in Supabase SQL Editor

-- Each product can define option groups like:
--   [{"name": "Color", "values": ["Red", "Blue"]}, {"name": "Size", "values": ["S", "M", "L"]}]
alter table products add column if not exists options jsonb not null default '[]'::jsonb;

-- Records which option value the buyer picked for each group, e.g.
--   {"Color": "Red", "Size": "M"}
alter table orders add column if not exists selected_options jsonb;
