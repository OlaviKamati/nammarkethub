# NamMarketHub

A marketplace where local Namibian electronics shops list products and buyers browse, search, and request to buy. v1 has no payment processing — buyers submit a request, the shop contacts them directly to arrange payment and pickup. Add real checkout once you have actual shops and orders flowing.

## Stack

- React + Vite (frontend)
- Tailwind CSS v4 (styling)
- Supabase (Postgres database, auth, file storage)

## Setup

### 1. Create a Supabase project

Go to supabase.com, create a free project. Note your project URL and anon/public key (Project Settings -> API).

### 2. Run the database schema

Open the Supabase SQL editor (left sidebar) -> New query -> paste the contents of `supabase/schema.sql` -> Run.

This creates the `shops`, `categories`, `products`, and `orders` tables, with row-level security so shop owners can only edit their own shop/products, and anyone can browse and request to buy.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Supabase URL and anon key from step 1.

### 4. Install and run

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

### 5. Add some test data

Since there's no shop-signup UI built yet (that's the next thing to build -- see below), insert a test shop and a few products directly via the Supabase Table Editor so you have something to look at:

- Go to Table Editor -> `shops` -> Insert row (you'll need an `owner_id`; create a test user under Authentication -> Users first, or temporarily relax the RLS policy while testing)
- Insert a few rows into `products` referencing that shop's id

## Project structure

```
src/
  components/      ShopStrip, CategoryFilter, ProductGrid, ProductCard, OrderModal
  pages/           Home.jsx (the main marketplace page)
  hooks/           useProducts, useShops (Supabase data fetching)
  lib/             supabase.js (client setup)
supabase/
  schema.sql       full database schema + row-level security policies
```

## What's built (v1 MVP)

- Browse shops (horizontal strip)
- Browse products by category
- Request to buy a product (logs an order, no payment yet)

## What's NOT built yet -- your next steps

Roughly in priority order:

1. **Shop owner signup/login** -- Supabase Auth (`supabase.auth.signUp`) + a form to create a shop record. Right now shops can only be added manually via the Supabase dashboard.
2. **"My shop" dashboard** -- a page for logged-in shop owners to add/edit/delete their own products and see incoming orders.
3. **Product photo upload** -- use Supabase Storage (a `product-photos` bucket) instead of the placeholder icon currently shown when `photo_url` is empty.
4. **Search** -- a simple text search box filtering by product name (`ilike` query on the `products` table).
5. **Deploy** -- push to GitHub, connect to Vercel, add your env vars in Vercel's project settings. Free tier is enough to start.

Once real shops are listing and real orders are coming through WhatsApp, that's your validation signal -- then it's worth adding real payment processing (Namibian options to look into: PayToday, DPO Group) and the AI features (auto-generated descriptions, chatbot, recommendations) discussed earlier.
