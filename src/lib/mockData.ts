import { Category, Product, Customer, Order, Media } from '../types/supabase';

export const mockCategories: Category[] = [
  { id: 'a1000000-0000-0000-0000-000000000001', name: 'Ηλεκτρονικά', slug: 'ilektronika', description: 'Smartphones, laptops, tablets και αξεσουάρ', image_url: '', seo_title: '', seo_description: '', parent_id: null, sort_order: 1, is_active: true, created_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', product_count: 4 },
  { id: 'a1000000-0000-0000-0000-000000000002', name: 'Ένδυση', slug: 'endysi', description: 'Ρούχα, παπούτσια και αξεσουάρ μόδας', image_url: '', seo_title: '', seo_description: '', parent_id: null, sort_order: 2, is_active: true, created_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', product_count: 0 },
  { id: 'a1000000-0000-0000-0000-000000000003', name: 'Σπίτι & Κήπος', slug: 'spiti-kipos', description: 'Έπιπλα, διακόσμηση και εργαλεία κήπου', image_url: '', seo_title: '', seo_description: '', parent_id: null, sort_order: 3, is_active: true, created_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', product_count: 0 },
  { id: 'a1000000-0000-0000-0000-000000000004', name: 'Αθλητικά', slug: 'athlitika', description: 'Αθλητικός εξοπλισμός και ενδύματα', image_url: '', seo_title: '', seo_description: '', parent_id: null, sort_order: 4, is_active: true, created_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', product_count: 2 },
  { id: 'a1000000-0000-0000-0000-000000000005', name: 'Βιβλία & Μουσική', slug: 'vivlia-mousiki', description: 'Βιβλία, μουσική και ψηφιακό περιεχόμενο', image_url: '', seo_title: '', seo_description: '', parent_id: null, sort_order: 5, is_active: true, created_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', product_count: 0 },
  { id: 'a1000000-0000-0000-0000-000000000006', name: 'Ομορφιά & Υγεία', slug: 'omorfia-ygeia', description: 'Καλλυντικά, περιποίηση και προϊόντα υγείας', image_url: '', seo_title: '', seo_description: '', parent_id: null, sort_order: 6, is_active: true, created_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', product_count: 0 },
];

export const mockProducts: Product[] = [
  { id: 'b1000000-0000-0000-0000-000000000001', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', description: 'Το πιο προηγμένο iPhone με chip A17 Pro, κάμερα 48MP και titanium σκελετό.', price: 1499.00, compare_price: 1699.00, cost_price: 1100.00, sku: 'APPL-IP15PM-256', barcode: '0194253401186', stock_quantity: 45, track_inventory: true, allow_backorder: false, weight: 0.221, category_id: 'a1000000-0000-0000-0000-000000000001', image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=800', images: [], tags: ['apple', 'smartphone', 'flagship'], is_active: true, is_featured: true, is_digital: false, created_by: null, created_at: '2024-01-10T10:00:00Z', updated_at: '2024-01-10T10:00:00Z' },
  { id: 'b1000000-0000-0000-0000-000000000002', name: 'MacBook Air M3', slug: 'macbook-air-m3', description: 'Ο πιο λεπτός και ελαφρύς laptop της Apple με το νέο chip M3 για εκπληκτική απόδοση.', price: 1299.00, compare_price: 1499.00, cost_price: 950.00, sku: 'APPL-MBA-M3-256', barcode: '0194253401187', stock_quantity: 28, track_inventory: true, allow_backorder: false, weight: 1.24, category_id: 'a1000000-0000-0000-0000-000000000001', image_url: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?w=800', images: [], tags: ['apple', 'laptop', 'm3'], is_active: true, is_featured: true, is_digital: false, created_by: null, created_at: '2024-01-11T10:00:00Z', updated_at: '2024-01-11T10:00:00Z' },
  { id: 'b1000000-0000-0000-0000-000000000003', name: 'Nike Air Max 270', slug: 'nike-air-max-270', description: 'Κλασικό sneaker με μεγάλη air unit στη φτέρνα για μέγιστη άνεση όλη μέρα.', price: 149.99, compare_price: 179.99, cost_price: 75.00, sku: 'NIKE-AM270-42', barcode: '0194253401188', stock_quantity: 120, track_inventory: true, allow_backorder: false, weight: 0.385, category_id: 'a1000000-0000-0000-0000-000000000004', image_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?w=800', images: [], tags: ['nike', 'sneaker', 'running'], is_active: true, is_featured: true, is_digital: false, created_by: null, created_at: '2024-01-12T10:00:00Z', updated_at: '2024-01-12T10:00:00Z' },
  { id: 'b1000000-0000-0000-0000-000000000004', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', description: 'Flagship Android smartphone με S Pen, κάμερα 200MP και AI features.', price: 1249.00, compare_price: 1399.00, cost_price: 900.00, sku: 'SAMS-S24U-512', barcode: '0194253401189', stock_quantity: 35, track_inventory: true, allow_backorder: false, weight: 0.232, category_id: 'a1000000-0000-0000-0000-000000000001', image_url: 'https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg?w=800', images: [], tags: ['samsung', 'smartphone', 'android'], is_active: true, is_featured: false, is_digital: false, created_by: null, created_at: '2024-01-13T10:00:00Z', updated_at: '2024-01-13T10:00:00Z' },
  { id: 'b1000000-0000-0000-0000-000000000005', name: 'Adidas Ultraboost 23', slug: 'adidas-ultraboost-23', description: 'Running παπούτσι με τεχνολογία Boost για εξαιρετική ενέργεια επιστροφής.', price: 189.99, compare_price: 220.00, cost_price: 95.00, sku: 'ADID-UB23-41', barcode: '0194253401190', stock_quantity: 67, track_inventory: true, allow_backorder: false, weight: 0.41, category_id: 'a1000000-0000-0000-0000-000000000004', image_url: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?w=800', images: [], tags: ['adidas', 'running', 'boost'], is_active: true, is_featured: false, is_digital: false, created_by: null, created_at: '2024-01-14T10:00:00Z', updated_at: '2024-01-14T10:00:00Z' },
  { id: 'b1000000-0000-0000-0000-000000000006', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', description: 'Industry-leading ακουστικά noise cancelling με 30 ώρες αυτονομία.', price: 349.00, compare_price: 399.00, cost_price: 220.00, sku: 'SONY-WH1XM5-BLK', barcode: '0194253401191', stock_quantity: 52, track_inventory: true, allow_backorder: false, weight: 0.25, category_id: 'a1000000-0000-0000-0000-000000000001', image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=800', images: [], tags: ['sony', 'headphones', 'noise-cancelling'], is_active: true, is_featured: false, is_digital: false, created_by: null, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
];

export const mockCustomers: Customer[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', email: 'maria.papadopoulou@gmail.com', first_name: 'Μαρία', last_name: 'Παπαδοπούλου', phone: '+30 697 1234567', avatar_url: '', date_of_birth: '1988-05-14', gender: 'female', membership_level: 'gold', loyalty_points: 2450, total_orders: 8, total_spent: 3240.50, average_order_value: 405.06, last_order_at: '2024-03-15T10:00:00Z', shipping_address: { street: 'Πατησίων 12', city: 'Αθήνα', postal_code: '11522', country: 'GR' }, billing_address: {}, tags: [], notes: '', is_active: true, accepts_marketing: true, created_at: '2023-06-01T00:00:00Z', updated_at: '2024-03-15T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000002', email: 'nikos.georgiou@yahoo.gr', first_name: 'Νίκος', last_name: 'Γεωργίου', phone: '+30 694 9876543', avatar_url: '', date_of_birth: '1992-11-22', gender: 'male', membership_level: 'silver', loyalty_points: 890, total_orders: 3, total_spent: 780.00, average_order_value: 260.00, last_order_at: '2024-02-20T10:00:00Z', shipping_address: { street: 'Σταδίου 45', city: 'Θεσσαλονίκη', postal_code: '54621', country: 'GR' }, billing_address: {}, tags: [], notes: '', is_active: true, accepts_marketing: false, created_at: '2023-09-15T00:00:00Z', updated_at: '2024-02-20T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000003', email: 'elena.konstantinou@hotmail.com', first_name: 'Ελένη', last_name: 'Κωνσταντίνου', phone: '+30 693 5551234', avatar_url: '', date_of_birth: '1985-03-08', gender: 'female', membership_level: 'platinum', loyalty_points: 5100, total_orders: 15, total_spent: 8750.00, average_order_value: 583.33, last_order_at: '2024-04-01T10:00:00Z', shipping_address: { street: 'Ερμού 78', city: 'Πάτρα', postal_code: '26221', country: 'GR' }, billing_address: {}, tags: ['vip'], notes: 'VIP πελάτης', is_active: true, accepts_marketing: true, created_at: '2023-01-10T00:00:00Z', updated_at: '2024-04-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000004', email: 'giorgos.alexiou@gmail.com', first_name: 'Γιώργος', last_name: 'Αλεξίου', phone: '+30 699 4447890', avatar_url: '', date_of_birth: '1995-07-30', gender: 'male', membership_level: 'bronze', loyalty_points: 120, total_orders: 1, total_spent: 149.99, average_order_value: 149.99, last_order_at: '2024-03-28T10:00:00Z', shipping_address: {}, billing_address: {}, tags: [], notes: '', is_active: true, accepts_marketing: false, created_at: '2024-03-28T00:00:00Z', updated_at: '2024-03-28T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000005', email: 'sofia.petridou@gmail.com', first_name: 'Σοφία', last_name: 'Πετρίδου', phone: '+30 698 3334455', avatar_url: '', date_of_birth: '1990-12-05', gender: 'female', membership_level: 'silver', loyalty_points: 1200, total_orders: 5, total_spent: 1850.00, average_order_value: 370.00, last_order_at: '2024-03-30T10:00:00Z', shipping_address: { street: 'Βενιζέλου 22', city: 'Ηράκλειο', postal_code: '71201', country: 'GR' }, billing_address: {}, tags: [], notes: '', is_active: true, accepts_marketing: true, created_at: '2023-11-05T00:00:00Z', updated_at: '2024-03-30T00:00:00Z' },
];

export const mockOrders: Order[] = [
  { id: 'd1000000-0000-0000-0000-000000000001', order_number: 'ORD-2024-001', customer_id: 'c1000000-0000-0000-0000-000000000001', status: 'delivered', payment_status: 'paid', payment_method: 'credit_card', subtotal: 1499.00, discount_amount: 0, shipping_cost: 0, tax_amount: 359.76, total: 1858.76, currency: 'EUR', notes: '', shipping_address: { street: 'Πατησίων 12', city: 'Αθήνα', postal_code: '11522', country: 'GR' }, billing_address: {}, tracking_number: 'GR123456789', shipped_at: '2024-03-12T10:00:00Z', delivered_at: '2024-03-15T14:00:00Z', cancelled_at: null, created_at: '2024-03-10T10:00:00Z', updated_at: '2024-03-15T14:00:00Z', customers: mockCustomers[0] },
  { id: 'd1000000-0000-0000-0000-000000000002', order_number: 'ORD-2024-002', customer_id: 'c1000000-0000-0000-0000-000000000003', status: 'shipped', payment_status: 'paid', payment_method: 'paypal', subtotal: 1299.00, discount_amount: 0, shipping_cost: 5.99, tax_amount: 312.12, total: 1617.11, currency: 'EUR', notes: '', shipping_address: { street: 'Ερμού 78', city: 'Πάτρα', postal_code: '26221', country: 'GR' }, billing_address: {}, tracking_number: 'GR987654321', shipped_at: '2024-04-02T09:00:00Z', delivered_at: null, cancelled_at: null, created_at: '2024-04-01T10:00:00Z', updated_at: '2024-04-02T09:00:00Z', customers: mockCustomers[2] },
  { id: 'd1000000-0000-0000-0000-000000000003', order_number: 'ORD-2024-003', customer_id: 'c1000000-0000-0000-0000-000000000002', status: 'processing', payment_status: 'paid', payment_method: 'credit_card', subtotal: 149.99, discount_amount: 0, shipping_cost: 5.99, tax_amount: 37.44, total: 193.42, currency: 'EUR', notes: '', shipping_address: {}, billing_address: {}, tracking_number: '', shipped_at: null, delivered_at: null, cancelled_at: null, created_at: '2024-04-03T08:00:00Z', updated_at: '2024-04-03T08:00:00Z', customers: mockCustomers[1] },
  { id: 'd1000000-0000-0000-0000-000000000004', order_number: 'ORD-2024-004', customer_id: 'c1000000-0000-0000-0000-000000000005', status: 'pending', payment_status: 'pending', payment_method: 'bank_transfer', subtotal: 349.00, discount_amount: 0, shipping_cost: 0, tax_amount: 83.76, total: 432.76, currency: 'EUR', notes: 'Παρακαλώ αποστολή γρήγορα', shipping_address: {}, billing_address: {}, tracking_number: '', shipped_at: null, delivered_at: null, cancelled_at: null, created_at: '2024-04-05T12:00:00Z', updated_at: '2024-04-05T12:00:00Z', customers: mockCustomers[4] },
  { id: 'd1000000-0000-0000-0000-000000000005', order_number: 'ORD-2024-005', customer_id: 'c1000000-0000-0000-0000-000000000004', status: 'confirmed', payment_status: 'paid', payment_method: 'credit_card', subtotal: 189.99, discount_amount: 0, shipping_cost: 5.99, tax_amount: 46.80, total: 242.78, currency: 'EUR', notes: '', shipping_address: {}, billing_address: {}, tracking_number: '', shipped_at: null, delivered_at: null, cancelled_at: null, created_at: '2024-04-06T15:00:00Z', updated_at: '2024-04-06T15:00:00Z', customers: mockCustomers[3] },
  { id: 'd1000000-0000-0000-0000-000000000006', order_number: 'ORD-2024-006', customer_id: 'c1000000-0000-0000-0000-000000000001', status: 'cancelled', payment_status: 'refunded', payment_method: 'credit_card', subtotal: 1249.00, discount_amount: 0, shipping_cost: 0, tax_amount: 0, total: 0, currency: 'EUR', notes: 'Ακυρώθηκε από τον πελάτη', shipping_address: {}, billing_address: {}, tracking_number: '', shipped_at: null, delivered_at: null, cancelled_at: '2024-04-07T11:00:00Z', created_at: '2024-04-07T09:00:00Z', updated_at: '2024-04-07T11:00:00Z', customers: mockCustomers[0] },
];

export const mockMedia: Media[] = [
  { id: 'm1', name: 'iphone-15-hero', original_name: 'iphone-15-hero.jpg', url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', public_id: 'products/iphone-15-hero', mime_type: 'image/jpeg', size: 245000, width: 800, height: 600, folder: 'products', alt_text: 'iPhone 15 Pro Max', caption: '', tags: [], created_by: null, created_at: '2024-01-10T10:00:00Z', updated_at: '2024-01-10T10:00:00Z' },
  { id: 'm2', name: 'macbook-air-m3', original_name: 'macbook-air-m3.jpg', url: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg', public_id: 'products/macbook-air-m3', mime_type: 'image/jpeg', size: 198000, width: 800, height: 534, folder: 'products', alt_text: 'MacBook Air M3', caption: '', tags: [], created_by: null, created_at: '2024-01-11T10:00:00Z', updated_at: '2024-01-11T10:00:00Z' },
  { id: 'm3', name: 'nike-air-max', original_name: 'nike-air-max.jpg', url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', public_id: 'products/nike-air-max', mime_type: 'image/jpeg', size: 312000, width: 800, height: 533, folder: 'products', alt_text: 'Nike Air Max 270', caption: '', tags: [], created_by: null, created_at: '2024-01-12T10:00:00Z', updated_at: '2024-01-12T10:00:00Z' },
  { id: 'm4', name: 'galaxy-s24', original_name: 'galaxy-s24.jpg', url: 'https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg', public_id: 'products/galaxy-s24', mime_type: 'image/jpeg', size: 187000, width: 800, height: 600, folder: 'products', alt_text: 'Samsung Galaxy S24 Ultra', caption: '', tags: [], created_by: null, created_at: '2024-01-13T10:00:00Z', updated_at: '2024-01-13T10:00:00Z' },
  { id: 'm5', name: 'adidas-ultraboost', original_name: 'adidas-ultraboost.jpg', url: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg', public_id: 'products/adidas-ultraboost', mime_type: 'image/jpeg', size: 276000, width: 800, height: 534, folder: 'products', alt_text: 'Adidas Ultraboost 23', caption: '', tags: [], created_by: null, created_at: '2024-01-14T10:00:00Z', updated_at: '2024-01-14T10:00:00Z' },
  { id: 'm6', name: 'sony-headphones', original_name: 'sony-headphones.jpg', url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', public_id: 'products/sony-headphones', mime_type: 'image/jpeg', size: 221000, width: 800, height: 534, folder: 'products', alt_text: 'Sony WH-1000XM5', caption: '', tags: [], created_by: null, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'm7', name: 'hero-banner', original_name: 'hero-banner.jpg', url: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', public_id: 'banners/hero-banner', mime_type: 'image/jpeg', size: 450000, width: 1920, height: 1080, folder: 'banners', alt_text: 'Hero Banner', caption: '', tags: [], created_by: null, created_at: '2024-01-16T10:00:00Z', updated_at: '2024-01-16T10:00:00Z' },
  { id: 'm8', name: 'about-team', original_name: 'about-team.jpg', url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', public_id: 'pages/about-team', mime_type: 'image/jpeg', size: 380000, width: 1200, height: 800, folder: 'pages', alt_text: 'About Team', caption: '', tags: [], created_by: null, created_at: '2024-01-17T10:00:00Z', updated_at: '2024-01-17T10:00:00Z' },
];

export const mockAnalytics = {
  totalRevenue: 24680.50,
  revenueChange: 12.4,
  totalOrders: 32,
  ordersChange: 8.1,
  totalCustomers: 5,
  customersChange: 23.5,
  averageOrderValue: 771.27,
  aovChange: 4.2,
  conversionRate: 3.2,
  monthlyRevenue: [
    { month: 'Ιαν', revenue: 1850, orders: 4 },
    { month: 'Φεβ', revenue: 2340, orders: 5 },
    { month: 'Μαρ', revenue: 3120, orders: 7 },
    { month: 'Απρ', revenue: 2780, orders: 6 },
    { month: 'Μαϊ', revenue: 4100, orders: 9 },
    { month: 'Ιουν', revenue: 3650, orders: 8 },
    { month: 'Ιουλ', revenue: 2900, orders: 6 },
    { month: 'Αυγ', revenue: 3450, orders: 7 },
    { month: 'Σεπ', revenue: 4200, orders: 9 },
    { month: 'Οκτ', revenue: 5100, orders: 11 },
    { month: 'Νοε', revenue: 4800, orders: 10 },
    { month: 'Δεκ', revenue: 6200, orders: 13 },
  ],
  topProducts: [
    { name: 'iPhone 15 Pro Max', sales: 12, revenue: 17988 },
    { name: 'MacBook Air M3', sales: 8, revenue: 10392 },
    { name: 'Sony WH-1000XM5', sales: 15, revenue: 5235 },
    { name: 'Samsung Galaxy S24 Ultra', sales: 6, revenue: 7494 },
    { name: 'Adidas Ultraboost 23', sales: 22, revenue: 4180 },
  ],
  salesByCategory: [
    { name: 'Ηλεκτρονικά', value: 68, color: '#3b82f6' },
    { name: 'Αθλητικά', value: 18, color: '#10b981' },
    { name: 'Ένδυση', value: 8, color: '#f59e0b' },
    { name: 'Σπίτι & Κήπος', value: 4, color: '#6366f1' },
    { name: 'Άλλα', value: 2, color: '#8b5cf6' },
  ],
  trafficSources: [
    { source: 'Organic Search', sessions: 4250, percentage: 42.5 },
    { source: 'Direct', sessions: 2800, percentage: 28.0 },
    { source: 'Social Media', sessions: 1650, percentage: 16.5 },
    { source: 'Email', sessions: 900, percentage: 9.0 },
    { source: 'Paid Ads', sessions: 400, percentage: 4.0 },
  ],
  deviceBreakdown: [
    { device: 'Mobile', percentage: 58 },
    { device: 'Desktop', percentage: 35 },
    { device: 'Tablet', percentage: 7 },
  ],
};
