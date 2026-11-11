import {
  Category, Product, Order, Coupon, RestaurantSettings, Review, AdminUser
} from '../types';

const API_BASE = '/api/v1';

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
  async login(username: string, password: string):Promise<{ access_token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(res);
  },

  async getMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Categories
  async getCategories(includeInactive = false): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories?include_inactive=${includeInactive}`);
    return handleResponse(res);
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteCategory(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
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
    return handleResponse(res);
  },

  async getProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  async createProduct(data: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateProduct(id: number, data: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async duplicateProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}/duplicate`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async toggleProductAvailability(id: number): Promise<{ id: number; is_available: boolean }> {
    const res = await fetch(`${API_BASE}/products/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(data: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getOrders(params?: Record<string, any>): Promise<Order[]> {
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
    return handleResponse(res);
  },

  async getOrder(orderRef: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderRef}`);
    return handleResponse(res);
  },

  async updateOrderStatus(id: number, status: string, payment_status?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, payment_status })
    });
    return handleResponse(res);
  },

  async getInvoice(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/${id}/invoice`);
    return handleResponse(res);
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; message: string; discount_amount: number; code?: string }> {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return handleResponse(res);
  },

  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch(`${API_BASE}/coupons`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteCoupon(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Settings
  async getSettings(): Promise<RestaurantSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse(res);
  },

  async updateSettings(data: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews`);
    return handleResponse(res);
  },

  async submitReview(data: { customer_name: string; rating: number; comment: string }): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getAdminReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews/admin`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async toggleReviewApproval(id: number): Promise<{ id: number; is_approved: boolean }> {
    const res = await fetch(`${API_BASE}/reviews/${id}/approve`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async deleteReview(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Analytics & Reports
  async getOverviewAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/overview`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getSalesChart(period = 'daily'): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analytics/sales-chart?period=${period}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getTopProducts(limit = 5): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analytics/top-products?limit=${limit}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getCustomers(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analytics/customers`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // File Upload
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    return handleResponse(res);
  }
};
