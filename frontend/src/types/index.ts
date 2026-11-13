/**
 * Core Data Models for Restaurant Menu SPA & Admin Dashboard
 */

export interface ItemSize {
  id?: number | string;
  name: string;
  name_ar?: string;
  name_en?: string;
  price: number;
  is_default?: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  name_en?: string;
  description: string;
  image_url: string;
  is_available: boolean;
  sizes: ItemSize[];
}

export interface Category {
  id: any;
  name: string;
  name_ar?: string;
  name_en?: string;
  icon?: string;
  image_url?: string;
  description?: string;
  description_ar?: string;
  sort_order?: number;
  display_order?: number;
  is_active?: boolean;
  parent_id?: number;
  product_count?: number;
  item_count?: number;
}

export interface RestaurantSettings {
  id?: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  currency: string;
  currency_symbol?: string;
  tagline?: string;
  phone: string;
  address: string;
  address_ar?: string;
  description?: string;
  description_ar?: string;
  logo_url?: string;
  cover_url?: string;
  whatsapp?: string;
  email?: string;
  google_maps_url?: string;
  opening_hours?: string;
  social_links_json?: string;
  hero_title?: string;
  hero_title_ar?: string;
  hero_subtitle?: string;
  hero_subtitle_ar?: string;
  hero_image?: string;
  primary_color?: string;
  active_sections_json?: string;
  min_order_value?: number;
  delivery_fee?: number;
  tax_percentage?: number;
}

// Modern Cart Item
export interface CartItem {
  id: string;
  item?: MenuItem;
  selectedSize?: ItemSize | any;
  product?: any;
  selectedExtras?: any[];
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  specialInstructions?: string;
}

// Backwards-compatible models
export interface ProductExtra {
  id?: number;
  name: string;
  name_ar: string;
  price: number;
  max_quantity?: number;
  is_available?: boolean;
}

export interface ProductImage {
  id?: number;
  image_url: string;
  is_primary?: boolean;
  display_order?: number;
}

export interface ProductSize {
  id?: number;
  name: string;
  name_ar: string;
  price: number;
  is_default?: boolean;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  product_type: string;
  base_price: number;
  discount_price?: number;
  image_url?: string;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  ingredients?: string;
  ingredients_ar?: string;
  calories?: number;
  prep_time_mins: number;
  display_order: number;
  sizes: ProductSize[];
  extras: ProductExtra[];
  images: ProductImage[];
  created_at?: string;
}

export interface CartExtraItem {
  extra_name: string;
  extra_name_ar?: string;
  extra_price: number;
  quantity: number;
}

export interface OrderItemExtra {
  id?: number;
  extra_name: string;
  extra_price: number;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  product_id?: number;
  product_name: string;
  product_name_ar?: string;
  size_name?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  special_instructions?: string;
  extras?: OrderItemExtra[];
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address?: string;
  order_type: 'delivery' | 'pickup' | 'dine_in';
  table_number?: string;
  notes?: string;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  coupon_code?: string;
  created_at: string;
  items: OrderItem[];
}

export interface Coupon {
  id: number;
  code: string;
  discount_percent?: number;
  discount_amount?: number;
  min_order_value: number;
  max_discount?: number;
  is_active: boolean;
  usage_count: number;
  valid_until?: string;
}

export interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
}
