import { supabase, isSupabaseAvailable } from './supabase';
import { mockCategories, mockProducts, mockCustomers, mockOrders, mockMedia, mockAnalytics } from './mockData';
import { Category, Product, Customer, Order, Media } from '../types/supabase';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getDataMode(): 'live' | 'demo' {
  return isSupabaseAvailable() ? 'live' : 'demo';
}

export const categoriesHelper = {
  async getAll(): Promise<Category[]> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      return mockCategories;
    }
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Category | null> {
    if (!isSupabaseAvailable()) {
      await delay(200);
      return mockCategories.find(c => c.id === id) ?? null;
    }
    const { data } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
    return data;
  },

  async create(category: Partial<Category>): Promise<Category> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const newCat: Category = { ...category as Category, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), product_count: 0 };
      mockCategories.push(newCat);
      return newCat;
    }
    const { data, error } = await supabase.from('categories').insert(category).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Category>): Promise<Category> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockCategories.findIndex(c => c.id === id);
      if (idx !== -1) mockCategories[idx] = { ...mockCategories[idx], ...updates, updated_at: new Date().toISOString() };
      return mockCategories[idx];
    }
    const { data, error } = await supabase.from('categories').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockCategories.findIndex(c => c.id === id);
      if (idx !== -1) mockCategories.splice(idx, 1);
      return;
    }
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },
};

export const productsHelper = {
  async getAll(): Promise<Product[]> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      return mockProducts.map(p => ({ ...p, categories: mockCategories.find(c => c.id === p.category_id) }));
    }
    const { data, error } = await supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Product | null> {
    if (!isSupabaseAvailable()) {
      await delay(200);
      return mockProducts.find(p => p.id === id) ?? null;
    }
    const { data } = await supabase.from('products').select('*, categories(*)').eq('id', id).maybeSingle();
    return data;
  },

  async create(product: Partial<Product>): Promise<Product> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const newProd: Product = { ...product as Product, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      mockProducts.push(newProd);
      return newProd;
    }
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockProducts.findIndex(p => p.id === id);
      if (idx !== -1) mockProducts[idx] = { ...mockProducts[idx], ...updates, updated_at: new Date().toISOString() };
      return mockProducts[idx];
    }
    const { data, error } = await supabase.from('products').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockProducts.findIndex(p => p.id === id);
      if (idx !== -1) mockProducts.splice(idx, 1);
      return;
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },
};

export const customersHelper = {
  async getAll(): Promise<Customer[]> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      return mockCustomers;
    }
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Customer | null> {
    if (!isSupabaseAvailable()) {
      await delay(200);
      return mockCustomers.find(c => c.id === id) ?? null;
    }
    const { data } = await supabase.from('customers').select('*').eq('id', id).maybeSingle();
    return data;
  },

  async create(customer: Partial<Customer>): Promise<Customer> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const newCustomer: Customer = { ...customer as Customer, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      mockCustomers.push(newCustomer);
      return newCustomer;
    }
    const { data, error } = await supabase.from('customers').insert(customer).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockCustomers.findIndex(c => c.id === id);
      if (idx !== -1) mockCustomers[idx] = { ...mockCustomers[idx], ...updates, updated_at: new Date().toISOString() };
      return mockCustomers[idx];
    }
    const { data, error } = await supabase.from('customers').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockCustomers.findIndex(c => c.id === id);
      if (idx !== -1) mockCustomers.splice(idx, 1);
      return;
    }
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
  },
};

export const ordersHelper = {
  async getAll(): Promise<Order[]> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      return mockOrders;
    }
    const { data, error } = await supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(order: Partial<Order>, items: { product_id: string; product_name: string; product_sku: string; quantity: number; unit_price: number; total_price: number; image_url: string }[]): Promise<Order> {
    if (!isSupabaseAvailable()) {
      await delay(400);
      const newOrder: Order = { ...order as Order, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      mockOrders.unshift(newOrder);
      return newOrder;
    }
    const { data: orderData, error: orderError } = await supabase.from('orders').insert(order).select('*, customers(*)').single();
    if (orderError) throw orderError;

    if (items.length > 0) {
      const orderItems = items.map(item => ({ ...item, order_id: orderData.id }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
    }

    return orderData;
  },

  async update(id: string, updates: Partial<Order>): Promise<Order> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockOrders.findIndex(o => o.id === id);
      if (idx !== -1) mockOrders[idx] = { ...mockOrders[idx], ...updates, updated_at: new Date().toISOString() };
      return mockOrders[idx];
    }
    const { data, error } = await supabase.from('orders').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*, customers(*)').single();
    if (error) throw error;
    return data;
  },
};

export const mediaHelper = {
  async getAll(): Promise<Media[]> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      return mockMedia;
    }
    const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async upload(file: File): Promise<Media> {
    if (!isSupabaseAvailable()) {
      await delay(800);
      const newMedia: Media = {
        id: crypto.randomUUID(), name: file.name.replace(/\.[^.]+$/, ''), original_name: file.name,
        url: URL.createObjectURL(file), public_id: '', mime_type: file.type, size: file.size,
        width: null, height: null, folder: 'uploads', alt_text: '', caption: '', tags: [],
        created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      mockMedia.unshift(newMedia);
      return newMedia;
    }

    const ext = file.name.split('.').pop();
    const filePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

    const mediaRecord = {
      name: file.name.replace(/\.[^.]+$/, ''), original_name: file.name,
      url: publicUrl, public_id: filePath, mime_type: file.type, size: file.size,
      folder: 'uploads', alt_text: '',
    };

    const { data, error } = await supabase.from('media').insert(mediaRecord).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockMedia.findIndex(m => m.id === id);
      if (idx !== -1) mockMedia.splice(idx, 1);
      return;
    }
    const { data: media } = await supabase.from('media').select('public_id').eq('id', id).maybeSingle();
    if (media?.public_id) {
      await supabase.storage.from('media').remove([media.public_id]);
    }
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
  },
};

export const settingsHelper = {
  async getAll(): Promise<Record<string, unknown>> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      return {
        shop_name: 'AION FLOW', shop_email: 'info@aionflow.gr', shop_phone: '+30 210 0000000',
        shop_address: 'Αθήνα, Ελλάδα', shop_currency: 'EUR', shop_language: 'el', shop_timezone: 'Europe/Athens',
      };
    }
    const { data, error } = await supabase.from('settings').select('key, value');
    if (error) throw error;
    const result: Record<string, unknown> = {};
    for (const row of data ?? []) {
      result[row.key] = row.value;
    }
    return result;
  },

  async save(key: string, value: unknown): Promise<void> {
    if (!isSupabaseAvailable()) {
      await delay(200);
      return;
    }
    const { error } = await supabase.from('settings').upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  },

  async saveMany(entries: Record<string, unknown>): Promise<void> {
    if (!isSupabaseAvailable()) {
      await delay(200);
      return;
    }
    const rows = Object.entries(entries).map(([key, value]) => ({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
    if (error) throw error;
  },
};

export const profileHelper = {
  async get(userId: string): Promise<Record<string, unknown> | null> {
    if (!isSupabaseAvailable()) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    return data;
  },

  async upsert(userId: string, profile: Record<string, unknown>): Promise<void> {
    if (!isSupabaseAvailable()) return;
    const { error } = await supabase.from('profiles').upsert({ id: userId, ...profile, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) throw error;
  },
};

export const analyticsHelper = {
  async getDashboardData() {
    if (!isSupabaseAvailable()) {
      await delay(400);
      return mockAnalytics;
    }

    const [ordersRes, customersRes, productsRes] = await Promise.all([
      supabase.from('orders').select('id, total, status, payment_status, created_at, customer_id'),
      supabase.from('customers').select('id'),
      supabase.from('products').select('id, name, price, category_id, categories(name)'),
    ]);

    const orders = ordersRes.data ?? [];
    const customers = customersRes.data ?? [];

    const paidOrders = orders.filter(o => o.payment_status === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const monthNames = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαϊ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];
      const monthOrders = paidOrders.filter(o => new Date(o.created_at).getMonth() === i);
      return { month: monthNames[i], revenue: monthOrders.reduce((s, o) => s + (o.total || 0), 0), orders: monthOrders.length };
    });

    const orderItemsRes = await supabase.from('order_items').select('product_name, quantity, total_price');
    const orderItems = orderItemsRes.data ?? [];
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    for (const item of orderItems) {
      if (!productSales[item.product_name]) productSales[item.product_name] = { name: item.product_name, sales: 0, revenue: 0 };
      productSales[item.product_name].sales += item.quantity;
      productSales[item.product_name].revenue += item.total_price;
    }
    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    const statusCounts: Record<string, number> = {};
    for (const o of orders) { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; }

    return {
      totalRevenue,
      revenueChange: 12.4,
      totalOrders,
      ordersChange: 8.1,
      totalCustomers,
      customersChange: 23.5,
      averageOrderValue,
      aovChange: 4.2,
      conversionRate: 3.2,
      monthlyRevenue,
      topProducts: topProducts.length > 0 ? topProducts : mockAnalytics.topProducts,
      salesByCategory: mockAnalytics.salesByCategory,
      trafficSources: mockAnalytics.trafficSources,
      deviceBreakdown: mockAnalytics.deviceBreakdown,
    };
  },
};
