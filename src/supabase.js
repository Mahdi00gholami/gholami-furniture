import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = supabaseReady
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: window.sessionStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    })
  : null;

export function getCartId() {
  const storageKey = 'gholami-furniture-cart-id';
  let cartId = window.sessionStorage.getItem(storageKey);
  if (!cartId) {
    cartId = crypto.randomUUID();
    window.sessionStorage.setItem(storageKey, cartId);
  }
  return cartId;
}

export const defaultItems = [
  { id: '1', title: 'Ergonomic Office Chair', roomCategory: 'office', material: 'Leather & Steel', image: '/chair 1.png', unitPriceAFN: 3500, availableQuantity: 5, description: 'Premium orthopedic swivel chair with lumbar support and adjustable height.' },
  { id: '2', title: 'Modern Executive Desk', roomCategory: 'office', material: 'Solid MDF', image: '/table 1.png', unitPriceAFN: 6000, availableQuantity: 4, description: 'Sleek office workstation featuring integrated cable management holes.' },
  { id: '3', title: 'Classic Wooden Dining Chair', roomCategory: 'dining room', material: 'Natural Oak', image: '/chair 2.png', unitPriceAFN: 1500, availableQuantity: 8, description: 'Minimalist finely polished timber chair, perfect for elegant dining rooms.' },
  { id: '4', title: 'Robust Workshop Dining Table', roomCategory: 'dining room', material: 'Walnut Wood', image: '/table 2.png', unitPriceAFN: 4000, availableQuantity: 3, description: 'Sturdy artisan crafted dining table designed for family gatherings.' },
  { id: '5', title: 'Luxury Accent Armchair', roomCategory: 'living room', material: 'Velvet Fabric', image: '/furniture 3.png', unitPriceAFN: 9500, availableQuantity: 6, description: 'Ultra-soft single sofa seat equipped with high-density comfort foam.' },
  { id: '6', title: 'Modern Living Room Sectional', roomCategory: 'living room', material: 'Premium Linen', image: '/furniture 4.png', unitPriceAFN: 24000, availableQuantity: 2, description: 'Contemporary style spacious sofa set tailored for luxury living spaces.' }
];

export function fromProductRow(row) {
  return {
    id: String(row.id), title: row.title, roomCategory: row.room_category,
    material: row.material, image: row.image, unitPriceAFN: Number(row.unit_price_afn),
    availableQuantity: Number(row.available_quantity), description: row.description || ''
  };
}

export function toProductRow(item) {
  return {
    id: String(item.id), title: item.title, room_category: item.roomCategory,
    material: item.material, image: item.image, unit_price_afn: Number(item.unitPriceAFN),
    available_quantity: Number(item.availableQuantity), description: item.description || ''
  };
}

export function configMessage() {
  return 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.';
}
