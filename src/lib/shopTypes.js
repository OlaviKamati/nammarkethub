// Central config for shop types and their product categories.
// Used in signup forms, product forms, and category filters.

export const SHOP_TYPES = [
  { id: 'electronics', label: 'Electronics',  emoji: '📱', color: 'bg-blue-50 text-blue-800' },
  { id: 'fashion',     label: 'Fashion',       emoji: '👗', color: 'bg-pink-50 text-pink-800' },
  { id: 'food',        label: 'Food & Drink',  emoji: '🛒', color: 'bg-green-50 text-green-800' },
  { id: 'furniture',   label: 'Furniture',     emoji: '🛋️', color: 'bg-amber-50 text-amber-800' },
  { id: 'general',     label: 'General',       emoji: '🏪', color: 'bg-stone-100 text-stone-700' },
]

export const CATEGORIES_BY_TYPE = {
  electronics: [
    { id: 'phones',      label: 'Phones' },
    { id: 'laptops',     label: 'Laptops' },
    { id: 'audio',       label: 'Audio' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'gaming',      label: 'Gaming' },
    { id: 'cameras',     label: 'Cameras' },
  ],
  fashion: [
    { id: 'mens',        label: "Men's Clothing" },
    { id: 'womens',      label: "Women's Clothing" },
    { id: 'shoes',       label: 'Shoes' },
    { id: 'bags',        label: 'Bags & Accessories' },
    { id: 'kids_fashion',label: 'Kids Fashion' },
  ],
  food: [
    { id: 'groceries',   label: 'Groceries' },
    { id: 'beverages',   label: 'Beverages' },
    { id: 'snacks',      label: 'Snacks' },
    { id: 'fresh',       label: 'Fresh Produce' },
    { id: 'packaged',    label: 'Packaged Food' },
  ],
  furniture: [
    { id: 'living_room', label: 'Living Room' },
    { id: 'bedroom',     label: 'Bedroom' },
    { id: 'office',      label: 'Office Furniture' },
    { id: 'outdoor',     label: 'Outdoor' },
    { id: 'kitchen',     label: 'Kitchen & Dining' },
  ],
  general: [
    { id: 'general',     label: 'General' },
  ],
}

// All categories flat, for the browse page "All" view
export const ALL_CATEGORIES = Object.values(CATEGORIES_BY_TYPE).flat()

export function getShopType(id) {
  return SHOP_TYPES.find((s) => s.id === id) ?? SHOP_TYPES[0]
}
