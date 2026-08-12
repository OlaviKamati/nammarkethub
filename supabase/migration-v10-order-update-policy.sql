-- NamMarketHub v10 migration
-- Fixes a serious bug: the "orders" table has Row Level Security enabled but was
-- MISSING an UPDATE policy entirely (only INSERT and SELECT policies existed).
-- That means every "Resolve" / "Attending" / note / deposit update a shop owner has
-- ever made was silently rejected by Postgres — the app never checked for the error,
-- so it looked like it worked, but nothing was actually saved. This adds the missing
-- policy so shop owners can update orders on their own products.
-- Run this in Supabase SQL Editor.

create policy "Shop owners can update orders for their products" on orders
  for update using (
    product_id in (
      select p.id from products p
      join shops s on s.id = p.shop_id
      where s.owner_id = auth.uid()
    )
  );
