import {
  Category, Product, Order, Coupon, RestaurantSettings, Review, AdminUser
} from '../types';
import {
  mockSettings, mockCategories, mockProducts, mockCoupons, mockReviews, mockOrders, mockAdminUser
} from './mockData';
import { restoreDatabase as restoreFirebaseDb, getStoredFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig, initFirebase } from './firebase';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

// Helper for local mock storage
function getStorage<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`gh_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`gh_${key}`, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// In-memory / localStorage state for offline or GitHub Pages mode
let categoriesState = getStorage<Category[]>('categories', mockCategories);
let productsState = getStorage<Product[]>('products', mockProducts);
let ordersState = getStorage<Order[]>('orders', mockOrders);
let couponsState = getStorage<Coupon[]>('coupons', mockCoupons);
let settingsState = getStorage<RestaurantSettings>('settings', mockSettings);
let reviewsState = getStorage<Review[]>('reviews', mockReviews);

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Authentication
  async login(username: string, password: string): Promise<{ access_token: string; user: AdminUser }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return await handleResponse(res);
    } catch {
      if (username === 'admin' && password === 'admin123') {
        const token = 'gh_demo_jwt_token_admin';
        localStorage.setItem('admin_token', token);
        return { access_token: token, user: mockAdminUser };
      }
      throw new Error('Invalid username or password (use admin / admin123)');
    }
  },

  async getMe(): Promise<AdminUser> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return mockAdminUser;
    }
  },

  // Categories
  async getCategories(includeInactive = false): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories?include_inactive=${includeInactive}`);
      return await handleResponse(res);
    } catch {
      return includeInactive ? categoriesState : categoriesState.filter(c => c.is_active);
    }
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      const newCat: Category = {
        id: Date.now(),
        name: data.name || 'New Category',
        name_ar: data.name_ar || 'تصنيف جديد',
        description: data.description,
        description_ar: data.description_ar,
        image_url: data.image_url,
        icon: data.icon || 'Utensils',
        display_order: data.display_order || (categoriesState.length + 1),
        is_active: data.is_active ?? true,
        product_count: 0
      };
      categoriesState = [...categoriesState, newCat];
      setStorage('categories', categoriesState);
      return newCat;
    }
  },

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      categoriesState = categoriesState.map(c => c.id === id ? { ...c, ...data } : c);
      setStorage('categories', categoriesState);
      return categoriesState.find(c => c.id === id)!;
    }
  },

  async deleteCategory(id: number): Promise<{ message: string }> {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      categoriesState = categoriesState.filter(c => c.id !== id);
      setStorage('categories', categoriesState);
      return { message: 'Category deleted successfully' };
    }
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            searchParams.append(key, String(val));
          }
        });
      }
      const queryString = searchParams.toString();
      const res = await fetch(`${API_BASE}/products${queryString ? `?${queryString}` : ''}`);
      return await handleResponse(res);
    } catch {
      let list = [...productsState];
      if (params?.category_id) {
        list = list.filter(p => p.category_id === Number(params.category_id));
      }
      if (params?.search) {
        const q = String(params.search).toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || (p.name_ar && p.name_ar.includes(q)));
      }
      if (params?.is_featured) list = list.filter(p => p.is_featured);
      if (params?.is_bestseller) list = list.filter(p => p.is_bestseller);
      if (params?.is_vegetarian) list = list.filter(p => p.is_vegetarian);
      if (params?.is_spicy) list = list.filter(p => p.is_spicy);
      return list;
    }
  },

  async getProduct(id: number): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      return await handleResponse(res);
    } catch {
      const p = productsState.find(x => x.id === id);
      if (!p) throw new Error('Product not found');
      return p;
    }
  },

  async createProduct(data: any): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      const newProduct: Product = {
        id: Date.now(),
        category_id: data.category_id,
        name: data.name,
        name_ar: data.name_ar,
        description: data.description,
        description_ar: data.description_ar,
        product_type: data.product_type || 'Food',
        base_price: Number(data.base_price),
        discount_price: data.discount_price ? Number(data.discount_price) : undefined,
        image_url: data.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        is_available: data.is_available ?? true,
        is_featured: !!data.is_featured,
        is_bestseller: !!data.is_bestseller,
        is_new: !!data.is_new,
        is_vegetarian: !!data.is_vegetarian,
        is_spicy: !!data.is_spicy,
        ingredients: data.ingredients,
        ingredients_ar: data.ingredients_ar,
        calories: data.calories,
        prep_time_mins: data.prep_time_mins || 15,
        display_order: data.display_order || productsState.length + 1,
        sizes: data.sizes || [],
        extras: data.extras || [],
        images: []
      };
      productsState = [newProduct, ...productsState];
      setStorage('products', productsState);
      return newProduct;
    }
  },

  async updateProduct(id: number, data: any): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      productsState = productsState.map(p => p.id === id ? { ...p, ...data } : p);
      setStorage('products', productsState);
      return productsState.find(p => p.id === id)!;
    }
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      productsState = productsState.filter(p => p.id !== id);
      setStorage('products', productsState);
      return { message: 'Product deleted successfully' };
    }
  },

  async duplicateProduct(id: number): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/duplicate`, {
        method: 'POST',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      const original = productsState.find(p => p.id === id);
      if (!original) throw new Error('Product not found');
      const dup: Product = {
        ...original,
        id: Date.now(),
        name: `${original.name} (Copy)`,
        name_ar: `${original.name_ar} (نسخة)`
      };
      productsState = [dup, ...productsState];
      setStorage('products', productsState);
      return dup;
    }
  },

  async toggleProductAvailability(id: number): Promise<{ id: number; is_available: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      let isAvail = false;
      productsState = productsState.map(p => {
        if (p.id === id) {
          isAvail = !p.is_available;
          return { ...p, is_available: isAvail };
        }
        return p;
      });
      setStorage('products', productsState);
      return { id, is_available: isAvail };
    }
  },

  // Orders
  async createOrder(data: any): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      const newOrder: Order = {
        id: Date.now(),
        order_number: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomHex}`,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone || data.phone_number || '',
        customer_email: data.customer_email,
        delivery_address: data.delivery_address,
        order_type: data.order_type || 'delivery',
        table_number: data.table_number,
        payment_method: data.payment_method || 'cash_on_delivery',
        payment_status: data.payment_method === 'online_card' ? 'paid' : 'pending',
        status: 'new',
        subtotal: data.subtotal,
        delivery_fee: data.delivery_fee || 0,
        discount_amount: data.discount_amount || 0,
        total: data.total || data.total_amount || 0,
        coupon_code: data.coupon_code,
        notes: data.notes,
        created_at: new Date().toISOString(),
        items: (data.items || []).map((it: any, idx: number) => ({
          id: idx + 1,
          product_id: it.product_id,
          product_name: it.product_name || 'Gourmet Dish',
          size_name: it.size_name,
          unit_price: it.unit_price,
          quantity: it.quantity,
          total_price: it.total_price,
          extras: it.extras || []
        }))
      };
      ordersState = [newOrder, ...ordersState];
      setStorage('orders', ordersState);
      return newOrder;
    }
  },

  async getOrders(params?: Record<string, any>): Promise<Order[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            searchParams.append(key, String(val));
          }
        });
      }
      const queryString = searchParams.toString();
      const res = await fetch(`${API_BASE}/orders${queryString ? `?${queryString}` : ''}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      let list = [...ordersState];
      if (params?.status) list = list.filter(o => o.status === params.status);
      return list;
    }
  },

  async getOrder(orderRef: string): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderRef}`);
      return await handleResponse(res);
    } catch {
      const o = ordersState.find(x => x.order_number === orderRef || String(x.id) === orderRef);
      if (!o) throw new Error('Order not found');
      return o;
    }
  },

  async updateOrderStatus(id: number, status: string, payment_status?: string): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status, payment_status })
      });
      return await handleResponse(res);
    } catch {
      ordersState = ordersState.map(o => {
        if (o.id === id) {
          return {
            ...o,
            status: status as any,
            ...(payment_status ? { payment_status: payment_status as any } : {})
          };
        }
        return o;
      });
      setStorage('orders', ordersState);
      return ordersState.find(o => o.id === id)!;
    }
  },

  async getInvoice(id: number): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/invoice`);
      return await handleResponse(res);
    } catch {
      const o = ordersState.find(x => x.id === id);
      return {
        order: o,
        restaurant: settingsState
      };
    }
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; message: string; discount_amount: number; code?: string }> {
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      return await handleResponse(res);
    } catch {
      const c = couponsState.find(x => x.code.toUpperCase() === code.trim().toUpperCase() && x.is_active);
      if (!c) {
        return { valid: false, message: 'Invalid or expired coupon code', discount_amount: 0 };
      }
      if (subtotal < (c.min_order_value || 0)) {
        return {
          valid: false,
          message: `Minimum order value for ${c.code} is $${c.min_order_value}`,
          discount_amount: 0
        };
      }
      let discount = 0;
      if (c.discount_percent) {
        discount = (subtotal * c.discount_percent) / 100;
        if (c.max_discount && discount > c.max_discount) {
          discount = c.max_discount;
        }
      } else if (c.discount_amount) {
        discount = c.discount_amount;
      }
      return {
        valid: true,
        message: `Coupon applied: Saved $${discount.toFixed(2)}`,
        discount_amount: Math.round(discount * 100) / 100,
        code: c.code
      };
    }
  },

  async getCoupons(): Promise<Coupon[]> {
    try {
      const res = await fetch(`${API_BASE}/coupons`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return couponsState;
    }
  },

  async createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    try {
      const res = await fetch(`${API_BASE}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      const newCoupon: Coupon = {
        id: Date.now(),
        code: (data.code || 'PROMO').toUpperCase(),
        discount_percent: data.discount_percent,
        discount_amount: data.discount_amount,
        min_order_value: Number(data.min_order_value) || 0,
        max_discount: data.max_discount ? Number(data.max_discount) : undefined,
        is_active: data.is_active ?? true,
        usage_count: 0
      };
      couponsState = [newCoupon, ...couponsState];
      setStorage('coupons', couponsState);
      return newCoupon;
    }
  },

  async deleteCoupon(id: number): Promise<{ message: string }> {
    try {
      const res = await fetch(`${API_BASE}/coupons/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      couponsState = couponsState.filter(c => c.id !== id);
      setStorage('coupons', couponsState);
      return { message: 'Coupon deleted successfully' };
    }
  },

  // Settings
  async getSettings(): Promise<RestaurantSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      return await handleResponse(res);
    } catch {
      return settingsState;
    }
  },

  async updateSettings(data: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      settingsState = { ...settingsState, ...data };
      setStorage('settings', settingsState);
      return settingsState;
    }
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      return await handleResponse(res);
    } catch {
      return reviewsState.filter(r => r.is_approved);
    }
  },

  async submitReview(data: { customer_name: string; rating: number; comment: string }): Promise<Review> {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await handleResponse(res);
    } catch {
      const newReview: Review = {
        id: Date.now(),
        customer_name: data.customer_name,
        rating: data.rating,
        comment: data.comment,
        is_approved: true,
        created_at: new Date().toISOString()
      };
      reviewsState = [newReview, ...reviewsState];
      setStorage('reviews', reviewsState);
      return newReview;
    }
  },

  async getAdminReviews(): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE}/reviews/admin`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return reviewsState;
    }
  },

  async toggleReviewApproval(id: number): Promise<{ id: number; is_approved: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      let approved = false;
      reviewsState = reviewsState.map(r => {
        if (r.id === id) {
          approved = !r.is_approved;
          return { ...r, is_approved: approved };
        }
        return r;
      });
      setStorage('reviews', reviewsState);
      return { id, is_approved: approved };
    }
  },

  async deleteReview(id: number): Promise<{ message: string }> {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      reviewsState = reviewsState.filter(r => r.id !== id);
      setStorage('reviews', reviewsState);
      return { message: 'Review deleted successfully' };
    }
  },

  // Analytics & Reports
  async getOverviewAnalytics(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      const totalRev = ordersState.reduce((acc, o) => acc + (o.total || 0), 0);
      return {
        gross_revenue: Math.round(totalRev * 100) / 100,
        total_orders: ordersState.length,
        pending_orders: ordersState.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length,
        completed_orders: ordersState.filter(o => o.status === 'completed').length,
        total_products: productsState.length,
        total_categories: categoriesState.length
      };
    }
  },

  async getSalesChart(period = 'daily'): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics/sales-chart?period=${period}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return [
        { label: 'Mon', revenue: 420.5, orders: 12 },
        { label: 'Tue', revenue: 580.0, orders: 18 },
        { label: 'Wed', revenue: 750.2, orders: 24 },
        { label: 'Thu', revenue: 890.0, orders: 28 },
        { label: 'Fri', revenue: 1420.0, orders: 42 },
        { label: 'Sat', revenue: 1850.5, orders: 55 },
        { label: 'Sun', revenue: 1610.0, orders: 48 }
      ];
    }
  },

  async getTopProducts(limit = 5): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics/top-products?limit=${limit}`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return productsState.slice(0, limit).map((p, idx) => ({
        id: p.id,
        name: p.name,
        name_ar: p.name_ar,
        total_sold: 45 - idx * 7,
        total_revenue: (45 - idx * 7) * p.base_price
      }));
    }
  },

  async getCustomers(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics/customers`, {
        headers: { ...getAuthHeader() }
      });
      return await handleResponse(res);
    } catch {
      return [
        { id: 1, name: 'Sarah Jenkins', phone: '+1 555-019-2831', orders_count: 5, total_spent: 245.80, last_order: '2026-11-11' },
        { id: 2, name: 'Omar Al-Khatib', phone: '+1 555-018-9941', orders_count: 3, total_spent: 112.50, last_order: '2026-11-11' },
        { id: 3, name: 'Elena Rostova', phone: '+1 555-014-5520', orders_count: 2, total_spent: 85.00, last_order: '2026-11-10' }
      ];
    }
  },

  // File Upload
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/uploads`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
        body: formData
      });
      return await handleResponse(res);
    } catch {
      return {
        url: URL.createObjectURL(file),
        filename: file.name
      };
    }
  },

  // Firebase & Database Restore
  async restoreDatabase(): Promise<{ success: boolean; message: string }> {
    const result = await restoreFirebaseDb();
    if (result.success) {
      categoriesState = getStorage<Category[]>('categories', mockCategories);
      productsState = getStorage<Product[]>('products', mockProducts);
      ordersState = getStorage<Order[]>('orders', mockOrders);
      couponsState = getStorage<Coupon[]>('coupons', mockCoupons);
      settingsState = getStorage<RestaurantSettings>('settings', mockSettings);
      reviewsState = getStorage<Review[]>('reviews', mockReviews);
    }
    return result;
  },

  getFirebaseConfig: getStoredFirebaseConfig,
  saveFirebaseConfig: saveFirebaseConfig,
  clearFirebaseConfig: clearFirebaseConfig
};
