import { Smartphone, Shirt, UtensilsCrossed, Sofa, Store } from 'lucide-react'

// Central config for shop types and their product categories.
// Used in signup forms, product forms, and category filters.

export const SHOP_TYPES = [
  { id: 'electronics', label: 'Electronics',  icon: Smartphone,      color: 'bg-blue-50 text-blue-800' },
  { id: 'fashion',     label: 'Fashion',       icon: Shirt,           color: 'bg-pink-50 text-pink-800' },
  { id: 'food',        label: 'Food & Drink',  icon: UtensilsCrossed, color: 'bg-green-50 text-green-800' },
  { id: 'furniture',   label: 'Furniture',     icon: Sofa,            color: 'bg-amber-50 text-amber-800' },
  { id: 'general',     label: 'General',       icon: Store,           color: 'bg-stone-100 text-stone-700' },
]

// Each category has a `group` — used to render shop owners' category picker
// as organized sections (subcategories under a shared heading) instead of one
// long flat list. Buyer-facing filters still show them as a flat pill row.
export const CATEGORIES_BY_TYPE = {
  electronics: [
    { id: 'phones',               label: 'Phones',               group: 'Phones & Tablets' },
    { id: 'tablets',              label: 'Tablets',               group: 'Phones & Tablets' },
    { id: 'laptops',              label: 'Laptops',               group: 'Computers' },
    { id: 'desktops',             label: 'Desktops',              group: 'Computers' },
    { id: 'computer_accessories', label: 'Computer Accessories',  group: 'Computers' },
    { id: 'audio',                label: 'Speakers & Audio',      group: 'Audio & Video' },
    { id: 'headphones',           label: 'Headphones',            group: 'Audio & Video' },
    { id: 'tvs',                  label: 'TVs',                   group: 'Audio & Video' },
    { id: 'gaming',               label: 'Gaming Consoles',       group: 'Gaming' },
    { id: 'gaming_accessories',   label: 'Gaming Accessories',    group: 'Gaming' },
    { id: 'cameras',              label: 'Cameras',                group: 'Cameras' },
    { id: 'smart_watches',        label: 'Smart Watches',         group: 'Accessories' },
    { id: 'chargers_cables',      label: 'Chargers & Cables',     group: 'Accessories' },
    { id: 'power_banks',          label: 'Power Banks',           group: 'Accessories' },
    { id: 'accessories',          label: 'Other Accessories',     group: 'Accessories' },
  ],
  fashion: [
    { id: 'mens_trousers',   label: "Trousers",              group: "Men's Clothing" },
    { id: 'mens_shirts',     label: "Shirts",                group: "Men's Clothing" },
    { id: 'mens_tshirts',    label: "T-Shirts",              group: "Men's Clothing" },
    { id: 'mens_jackets',    label: "Jackets & Hoodies",     group: "Men's Clothing" },
    { id: 'mens',            label: "Other Men's Clothing",  group: "Men's Clothing" },
    { id: 'womens_dresses',  label: "Dresses",               group: "Women's Clothing" },
    { id: 'womens_tops',     label: "Tops",                  group: "Women's Clothing" },
    { id: 'womens_bottoms',  label: "Trousers & Skirts",     group: "Women's Clothing" },
    { id: 'womens',          label: "Other Women's Clothing",group: "Women's Clothing" },
    { id: 'kids_fashion',    label: 'Kids Fashion',          group: 'Kids' },
    { id: 'shoes',           label: 'Shoes & Sneakers',      group: 'Footwear' },
    { id: 'sandals',         label: 'Sandals & Slippers',    group: 'Footwear' },
    { id: 'socks',           label: 'Socks',                 group: 'Footwear' },
    { id: 'hats',            label: 'Hats & Caps',           group: 'Accessories' },
    { id: 'jewelry',         label: 'Jewelry & Watches',     group: 'Accessories' },
    { id: 'bags',            label: 'Bags & Accessories',    group: 'Accessories' },
  ],
  food: [
    { id: 'groceries',   label: 'Groceries',       group: 'Food' },
    { id: 'beverages',   label: 'Beverages',       group: 'Food' },
    { id: 'snacks',      label: 'Snacks',          group: 'Food' },
    { id: 'fresh',       label: 'Fresh Produce',   group: 'Food' },
    { id: 'packaged',    label: 'Packaged Food',   group: 'Food' },
  ],
  furniture: [
    { id: 'sofas_couches',    label: 'Sofas & Couches',           group: 'Living Room' },
    { id: 'living_room',      label: 'Tables & Living Storage',   group: 'Living Room' },
    { id: 'tv_stands',        label: 'TV Stands & Units',         group: 'Living Room' },
    { id: 'beds',             label: 'Beds',                      group: 'Bedroom' },
    { id: 'mattresses',       label: 'Mattresses',                group: 'Bedroom' },
    { id: 'wardrobes',        label: 'Wardrobes & Closets',       group: 'Bedroom' },
    { id: 'bedroom',          label: 'Other Bedroom Furniture',   group: 'Bedroom' },
    { id: 'dining_tables',    label: 'Dining Tables & Chairs',    group: 'Kitchen & Dining' },
    { id: 'kitchen',          label: 'Kitchen Units',             group: 'Kitchen & Dining' },
    { id: 'office',           label: 'Desks & Office Chairs',     group: 'Office' },
    { id: 'office_storage',   label: 'Office Storage & Shelving', group: 'Office' },
    { id: 'outdoor',          label: 'Outdoor & Patio',           group: 'Outdoor' },
    { id: 'decor',            label: 'Home Decor',                group: 'Decor & Lighting' },
    { id: 'lighting',         label: 'Lighting',                  group: 'Decor & Lighting' },
    { id: 'storage_shelving', label: 'Storage & Shelving',        group: 'Storage' },
  ],
  general: [
    { id: 'general',     label: 'General', group: 'General' },
  ],
}

// All categories flat, for the browse page "All" view
export const ALL_CATEGORIES = Object.values(CATEGORIES_BY_TYPE).flat()

export function getShopType(id) {
  return SHOP_TYPES.find((s) => s.id === id) ?? SHOP_TYPES[0]
}
