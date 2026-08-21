import { Smartphone, Shirt, UtensilsCrossed, Sofa, Store, Car, Sparkles, Dumbbell, Baby, BookOpen, PawPrint, Hammer, Sprout } from 'lucide-react'

// Central config for shop types and their product categories.
// Used in signup forms, product forms, and category filters.

export const SHOP_TYPES = [
  { id: 'electronics',      label: 'Electronics',         icon: Smartphone,      color: 'bg-blue-50 text-blue-800' },
  { id: 'fashion',          label: 'Fashion',             icon: Shirt,           color: 'bg-pink-50 text-pink-800' },
  { id: 'food',             label: 'Food & Drink',        icon: UtensilsCrossed, color: 'bg-green-50 text-green-800' },
  { id: 'furniture',        label: 'Furniture',           icon: Sofa,            color: 'bg-amber-50 text-amber-800' },
  { id: 'automotive',       label: 'Automotive',          icon: Car,             color: 'bg-slate-100 text-slate-800' },
  { id: 'beauty',           label: 'Beauty & Personal Care', icon: Sparkles,     color: 'bg-rose-50 text-rose-800' },
  { id: 'sports',           label: 'Sports & Outdoors',   icon: Dumbbell,        color: 'bg-lime-50 text-lime-800' },
  { id: 'baby_kids',        label: 'Baby & Kids',         icon: Baby,            color: 'bg-sky-50 text-sky-800' },
  { id: 'books_stationery', label: 'Books & Stationery',  icon: BookOpen,        color: 'bg-indigo-50 text-indigo-800' },
  { id: 'pets',             label: 'Pet Supplies',        icon: PawPrint,        color: 'bg-orange-50 text-orange-800' },
  { id: 'hardware',         label: 'Tools & Hardware',    icon: Hammer,          color: 'bg-zinc-100 text-zinc-800' },
  { id: 'agriculture',      label: 'Agriculture & Farming', icon: Sprout,        color: 'bg-emerald-50 text-emerald-800' },
  { id: 'general',          label: 'General',             icon: Store,           color: 'bg-stone-100 text-stone-700' },
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
  // Vehicle type (sedan/SUV/bakkie/etc.) is the category — make and model
  // (e.g. "Volkswagen Polo") belong in the product name/description, the
  // same way a phone's brand isn't a separate Electronics category either.
  automotive: [
    { id: 'cars_sedans',        label: 'Sedans',                    group: 'Cars' },
    { id: 'cars_suvs',          label: 'SUVs & 4x4s',               group: 'Cars' },
    { id: 'cars_bakkies',       label: 'Bakkies & Pickups',         group: 'Cars' },
    { id: 'cars_hatchbacks',    label: 'Hatchbacks',                group: 'Cars' },
    { id: 'commercial_vehicles',label: 'Commercial Vehicles & Trucks', group: 'Cars' },
    { id: 'motorbikes',         label: 'Motorbikes & Scooters',     group: 'Motorbikes' },
    { id: 'auto_parts',         label: 'Auto Parts & Accessories',  group: 'Parts & Accessories' },
    { id: 'tyres_rims',         label: 'Tyres & Rims',              group: 'Parts & Accessories' },
    { id: 'car_audio',          label: 'Car Audio & Electronics',   group: 'Parts & Accessories' },
    { id: 'car_care',           label: 'Car Care & Detailing',      group: 'Parts & Accessories' },
  ],
  beauty: [
    { id: 'skincare',      label: 'Skincare',                 group: 'Face & Skin' },
    { id: 'makeup',        label: 'Makeup & Cosmetics',       group: 'Face & Skin' },
    { id: 'haircare',      label: 'Haircare',                 group: 'Hair' },
    { id: 'hair_extensions',label: 'Wigs & Extensions',       group: 'Hair' },
    { id: 'fragrances',    label: 'Perfumes & Fragrances',    group: 'Fragrance' },
    { id: 'personal_care', label: 'Personal Care & Hygiene',  group: 'Personal Care' },
    { id: 'beauty_tools',  label: 'Beauty Tools & Accessories', group: 'Personal Care' },
  ],
  sports: [
    { id: 'fitness_equipment', label: 'Fitness Equipment', group: 'Fitness' },
    { id: 'sportswear',        label: 'Sportswear',        group: 'Fitness' },
    { id: 'team_sports',       label: 'Team Sports Gear',  group: 'Sports Gear' },
    { id: 'cycling',           label: 'Cycling',           group: 'Sports Gear' },
    { id: 'camping_hiking',    label: 'Camping & Hiking',  group: 'Outdoors' },
    { id: 'fishing_hunting',   label: 'Fishing & Hunting', group: 'Outdoors' },
  ],
  baby_kids: [
    { id: 'baby_gear',      label: 'Prams, Car Seats & Carriers', group: 'Baby Gear' },
    { id: 'baby_feeding',   label: 'Feeding & Nursing',          group: 'Baby Gear' },
    { id: 'nappies_care',   label: 'Nappies & Baby Care',        group: 'Baby Gear' },
    { id: 'toys',           label: 'Toys & Games',               group: 'Toys' },
    { id: 'kids_furniture', label: "Kids' Furniture",            group: 'Kids Room' },
  ],
  books_stationery: [
    { id: 'books',        label: 'Books',                          group: 'Books' },
    { id: 'textbooks',    label: 'Textbooks & Study Guides',       group: 'Books' },
    { id: 'stationery',   label: 'Stationery & Office Supplies',   group: 'Stationery' },
    { id: 'art_supplies', label: 'Art & Craft Supplies',           group: 'Stationery' },
  ],
  pets: [
    { id: 'pet_food',        label: 'Pet Food',              group: 'Pet Care' },
    { id: 'pet_accessories', label: 'Pet Accessories',       group: 'Pet Care' },
    { id: 'pet_health',      label: 'Pet Health & Grooming', group: 'Pet Care' },
  ],
  hardware: [
    { id: 'hand_tools',          label: 'Hand Tools',                    group: 'Tools' },
    { id: 'power_tools',         label: 'Power Tools',                   group: 'Tools' },
    { id: 'building_materials',  label: 'Building Materials',            group: 'Building Materials' },
    { id: 'plumbing_electrical', label: 'Plumbing & Electrical Supplies',group: 'Building Materials' },
    { id: 'paint_hardware',      label: 'Paint & Hardware',              group: 'Building Materials' },
  ],
  agriculture: [
    { id: 'livestock_feed',    label: 'Livestock & Animal Feed',        group: 'Livestock' },
    { id: 'farming_equipment', label: 'Farming Equipment & Machinery',  group: 'Equipment' },
    { id: 'seeds_fertilizer',  label: 'Seeds & Fertilizer',             group: 'Crops' },
    { id: 'irrigation',        label: 'Irrigation & Water Supply',      group: 'Equipment' },
  ],
  general: [
    { id: 'general',     label: 'General', group: 'General' },
  ],
}

// All categories flat, for the browse page "All" view
export const ALL_CATEGORIES = Object.values(CATEGORIES_BY_TYPE).flat()

// Reverse lookup: category id -> the shop type it's listed under. Used so a
// shop can pick a category that isn't from their own registered shop type
// (e.g. a Fashion shop also listing a phone case) while still labeling where
// that category normally lives.
export const CATEGORY_SHOP_TYPE = Object.fromEntries(
  Object.entries(CATEGORIES_BY_TYPE).flatMap(([typeId, cats]) => cats.map((c) => [c.id, typeId]))
)

export function getShopType(id) {
  return SHOP_TYPES.find((s) => s.id === id) ?? SHOP_TYPES[0]
}
