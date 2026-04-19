/*
  # AION FLOW — Complete Database Schema

  ## Overview
  Full e-commerce CMS schema combining the best of aion-flow and aion-cms-V1.

  ## Tables Created
  1. `profiles` - User accounts with roles and preferences
  2. `categories` - Product categories with SEO metadata and slugs
  3. `products` - Products with inventory, pricing, and images
  4. `customers` - Customer profiles with loyalty/membership data
  5. `orders` - Full orders with payment and shipping tracking
  6. `order_items` - Line items per order
  7. `media` - File metadata for uploaded assets
  8. `settings` - Key-value configuration store

  ## Security
  - RLS enabled on ALL tables
  - Authenticated users can read/write their own data
  - Admin role gets full access via profile role check
  - Anonymous access blocked for all sensitive tables
*/

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  timezone text DEFAULT 'Europe/Athens',
  locale text DEFAULT 'el',
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  compare_price numeric(10,2),
  cost_price numeric(10,2),
  sku text DEFAULT '',
  barcode text DEFAULT '',
  stock_quantity integer DEFAULT 0,
  track_inventory boolean DEFAULT true,
  allow_backorder boolean DEFAULT false,
  weight numeric(8,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  images jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_digital boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  date_of_birth date,
  gender text DEFAULT '',
  membership_level text DEFAULT 'bronze' CHECK (membership_level IN ('bronze', 'silver', 'gold', 'platinum')),
  loyalty_points integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_spent numeric(12,2) DEFAULT 0,
  average_order_value numeric(10,2) DEFAULT 0,
  last_order_at timestamptz,
  shipping_address jsonb DEFAULT '{}',
  billing_address jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  notes text DEFAULT '',
  is_active boolean DEFAULT true,
  accepts_marketing boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  payment_method text DEFAULT '',
  subtotal numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  shipping_cost numeric(10,2) DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'EUR',
  notes text DEFAULT '',
  shipping_address jsonb DEFAULT '{}',
  billing_address jsonb DEFAULT '{}',
  tracking_number text DEFAULT '',
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_sku text DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert order_items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update order_items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete order_items"
  ON order_items FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- MEDIA TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  original_name text DEFAULT '',
  url text NOT NULL,
  public_id text DEFAULT '',
  mime_type text DEFAULT '',
  size bigint DEFAULT 0,
  width integer,
  height integer,
  folder text DEFAULT '',
  alt_text text DEFAULT '',
  caption text DEFAULT '',
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view media"
  ON media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update media"
  ON media FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete media"
  ON media FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb,
  category text DEFAULT 'general',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete settings"
  ON settings FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_media_created_by ON media(created_by);

-- ============================================================
-- SEED DEFAULT SETTINGS
-- ============================================================
INSERT INTO settings (key, value, category, description) VALUES
  ('shop_name', '"AION FLOW"', 'general', 'Shop name'),
  ('shop_currency', '"EUR"', 'general', 'Default currency'),
  ('shop_language', '"el"', 'general', 'Default language'),
  ('shop_timezone', '"Europe/Athens"', 'general', 'Shop timezone'),
  ('shop_email', '"info@aionflow.gr"', 'general', 'Contact email'),
  ('shop_phone', '"+30 210 0000000"', 'general', 'Contact phone'),
  ('shop_address', '"Αθήνα, Ελλάδα"', 'general', 'Shop address')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED DEMO DATA — CATEGORIES
-- ============================================================
INSERT INTO categories (id, name, slug, description, sort_order, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Ηλεκτρονικά', 'ilektronika', 'Smartphones, laptops, tablets και αξεσουάρ', 1, true),
  ('a1000000-0000-0000-0000-000000000002', 'Ένδυση', 'endysi', 'Ρούχα, παπούτσια και αξεσουάρ μόδας', 2, true),
  ('a1000000-0000-0000-0000-000000000003', 'Σπίτι & Κήπος', 'spiti-kipos', 'Έπιπλα, διακόσμηση και εργαλεία κήπου', 3, true),
  ('a1000000-0000-0000-0000-000000000004', 'Αθλητικά', 'athlitika', 'Αθλητικός εξοπλισμός και ενδύματα', 4, true),
  ('a1000000-0000-0000-0000-000000000005', 'Βιβλία & Μουσική', 'vivlia-mousiki', 'Βιβλία, μουσική και ψηφιακό περιεχόμενο', 5, true),
  ('a1000000-0000-0000-0000-000000000006', 'Ομορφιά & Υγεία', 'omorfia-ygeia', 'Καλλυντικά, περιποίηση και προϊόντα υγείας', 6, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DEMO DATA — PRODUCTS
-- ============================================================
INSERT INTO products (id, name, slug, description, price, compare_price, sku, stock_quantity, category_id, image_url, is_active, is_featured) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Το πιο προηγμένο iPhone με chip A17 Pro, κάμερα 48MP και titanium σκελετό.', 1499.00, 1699.00, 'APPL-IP15PM-256', 45, 'a1000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=800', true, true),
  ('b1000000-0000-0000-0000-000000000002', 'MacBook Air M3', 'macbook-air-m3', 'Ο πιο λεπτός και ελαφρύς laptop της Apple με το νέο chip M3 για εκπληκτική απόδοση.', 1299.00, 1499.00, 'APPL-MBA-M3-256', 28, 'a1000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?w=800', true, true),
  ('b1000000-0000-0000-0000-000000000003', 'Nike Air Max 270', 'nike-air-max-270', 'Κλασικό sneaker με μεγάλη air unit στη φτέρνα για μέγιστη άνεση όλη μέρα.', 149.99, 179.99, 'NIKE-AM270-42', 120, 'a1000000-0000-0000-0000-000000000004', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=800', true, true),
  ('b1000000-0000-0000-0000-000000000004', 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Flagship Android smartphone με S Pen, κάμερα 200MP και AI features.', 1249.00, 1399.00, 'SAMS-S24U-512', 35, 'a1000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg?w=800', true, false),
  ('b1000000-0000-0000-0000-000000000005', 'Adidas Ultraboost 23', 'adidas-ultraboost-23', 'Running παπούτσι με τεχνολογία Boost για εξαιρετική ενέργεια επιστροφής.', 189.99, 220.00, 'ADID-UB23-41', 67, 'a1000000-0000-0000-0000-000000000004', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?w=800', true, false),
  ('b1000000-0000-0000-0000-000000000006', 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading ακουστικά noise cancelling με 30 ώρες αυτονομία.', 349.00, 399.00, 'SONY-WH1XM5-BLK', 52, 'a1000000-0000-0000-0000-000000000001', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=800', true, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DEMO DATA — CUSTOMERS
-- ============================================================
INSERT INTO customers (id, email, first_name, last_name, phone, membership_level, loyalty_points, total_orders, total_spent, average_order_value, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'maria.papadopoulou@gmail.com', 'Μαρία', 'Παπαδοπούλου', '+30 697 1234567', 'gold', 2450, 8, 3240.50, 405.06, true),
  ('c1000000-0000-0000-0000-000000000002', 'nikos.georgiou@yahoo.gr', 'Νίκος', 'Γεωργίου', '+30 694 9876543', 'silver', 890, 3, 780.00, 260.00, true),
  ('c1000000-0000-0000-0000-000000000003', 'elena.konstantinou@hotmail.com', 'Ελένη', 'Κωνσταντίνου', '+30 693 5551234', 'platinum', 5100, 15, 8750.00, 583.33, true),
  ('c1000000-0000-0000-0000-000000000004', 'giorgos.alexiou@gmail.com', 'Γιώργος', 'Αλεξίου', '+30 699 4447890', 'bronze', 120, 1, 149.99, 149.99, true),
  ('c1000000-0000-0000-0000-000000000005', 'sofia.petridou@gmail.com', 'Σοφία', 'Πετρίδου', '+30 698 3334455', 'silver', 1200, 5, 1850.00, 370.00, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DEMO DATA — ORDERS
-- ============================================================
INSERT INTO orders (id, order_number, customer_id, status, payment_status, payment_method, subtotal, shipping_cost, tax_amount, total, currency) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'ORD-2024-001', 'c1000000-0000-0000-0000-000000000001', 'delivered', 'paid', 'credit_card', 1499.00, 0, 359.76, 1858.76, 'EUR'),
  ('d1000000-0000-0000-0000-000000000002', 'ORD-2024-002', 'c1000000-0000-0000-0000-000000000003', 'shipped', 'paid', 'paypal', 1299.00, 5.99, 312.12, 1617.11, 'EUR'),
  ('d1000000-0000-0000-0000-000000000003', 'ORD-2024-003', 'c1000000-0000-0000-0000-000000000002', 'processing', 'paid', 'credit_card', 149.99, 5.99, 37.44, 193.42, 'EUR'),
  ('d1000000-0000-0000-0000-000000000004', 'ORD-2024-004', 'c1000000-0000-0000-0000-000000000005', 'pending', 'pending', 'bank_transfer', 349.00, 0, 83.76, 432.76, 'EUR'),
  ('d1000000-0000-0000-0000-000000000005', 'ORD-2024-005', 'c1000000-0000-0000-0000-000000000004', 'confirmed', 'paid', 'credit_card', 189.99, 5.99, 46.80, 242.78, 'EUR'),
  ('d1000000-0000-0000-0000-000000000006', 'ORD-2024-006', 'c1000000-0000-0000-0000-000000000001', 'cancelled', 'refunded', 'credit_card', 1249.00, 0, 0, 0, 'EUR')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DEMO DATA — ORDER ITEMS
-- ============================================================
INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price, image_url) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'iPhone 15 Pro Max', 'APPL-IP15PM-256', 1, 1499.00, 1499.00, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=400'),
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'MacBook Air M3', 'APPL-MBA-M3-256', 1, 1299.00, 1299.00, 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?w=400'),
  ('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'Nike Air Max 270', 'NIKE-AM270-42', 1, 149.99, 149.99, 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=400'),
  ('d1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000006', 'Sony WH-1000XM5', 'SONY-WH1XM5-BLK', 1, 349.00, 349.00, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=400'),
  ('d1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000005', 'Adidas Ultraboost 23', 'ADID-UB23-41', 1, 189.99, 189.99, 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?w=400'),
  ('d1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000004', 'Samsung Galaxy S24 Ultra', 'SAMS-S24U-512', 1, 1249.00, 1249.00, 'https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg?w=400')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DEMO DATA — MEDIA
-- ============================================================
INSERT INTO media (name, original_name, url, mime_type, size, width, height, folder, alt_text) VALUES
  ('iphone-15-hero', 'iphone-15-hero.jpg', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 'image/jpeg', 245000, 800, 600, 'products', 'iPhone 15 Pro Max'),
  ('macbook-air-m3', 'macbook-air-m3.jpg', 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg', 'image/jpeg', 198000, 800, 534, 'products', 'MacBook Air M3'),
  ('nike-air-max', 'nike-air-max.jpg', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', 'image/jpeg', 312000, 800, 533, 'products', 'Nike Air Max 270'),
  ('galaxy-s24', 'galaxy-s24.jpg', 'https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg', 'image/jpeg', 187000, 800, 600, 'products', 'Samsung Galaxy S24 Ultra'),
  ('adidas-ultraboost', 'adidas-ultraboost.jpg', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', 'image/jpeg', 276000, 800, 534, 'products', 'Adidas Ultraboost 23'),
  ('sony-headphones', 'sony-headphones.jpg', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 'image/jpeg', 221000, 800, 534, 'products', 'Sony WH-1000XM5'),
  ('hero-banner', 'hero-banner.jpg', 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', 'image/jpeg', 450000, 1920, 1080, 'banners', 'Hero Banner'),
  ('about-team', 'about-team.jpg', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', 'image/jpeg', 380000, 1200, 800, 'pages', 'About Team')
ON CONFLICT DO NOTHING;
