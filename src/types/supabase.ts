export type UserRole = 'admin' | 'editor' | 'viewer';
export type MembershipLevel = 'bronze' | 'silver' | 'gold' | 'platinum';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  timezone: string;
  locale: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  seo_title: string;
  seo_description: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  sku: string;
  barcode: string;
  stock_quantity: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  weight: number | null;
  category_id: string | null;
  image_url: string;
  images: string[];
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  date_of_birth: string | null;
  gender: string;
  membership_level: MembershipLevel;
  loyalty_points: number;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_at: string | null;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  tags: string[];
  notes: string;
  is_active: boolean;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes: string;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  tracking_number: string;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  customers?: Customer;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string;
  created_at: string;
}

export interface Media {
  id: string;
  name: string;
  original_name: string;
  url: string;
  public_id: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  folder: string;
  alt_text: string;
  caption: string;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}
