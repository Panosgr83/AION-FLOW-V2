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

  async delete(id: string): Promise<void> {
    if (!isSupabaseAvailable()) {
      await delay(300);
      const idx = mockMedia.findIndex(m => m.id === id);
      if (idx !== -1) mockMedia.splice(idx, 1);
      return;
    }
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
  },
};

export const analyticsHelper = {
  async getDashboardData() {
    await delay(isSupabaseAvailable() ? 0 : 400);
    return mockAnalytics;
  },
};
