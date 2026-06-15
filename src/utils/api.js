// API utility for communicating with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  register: async (email, password, displayName, businessName) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: { email, password, displayName, businessName },
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  logout: async () => {
    await apiCall('/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me', { method: 'GET' });
  },

  updateBusinessName: async (businessName) => {
    return apiCall('/auth/business-name', {
      method: 'PUT',
      body: { businessName },
    });
  },

  updateProfile: async (displayName) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: { displayName },
    });
  },

  changePassword: async (oldPassword, newPassword) => {
    return apiCall('/auth/change-password', {
      method: 'PUT',
      body: { oldPassword, newPassword },
    });
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    return apiCall('/products', { method: 'GET' });
  },

  getById: async (id) => {
    return apiCall(`/products/${id}`, { method: 'GET' });
  },

  create: async (productData) => {
    return apiCall('/products', {
      method: 'POST',
      body: productData,
    });
  },

  update: async (id, productData) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  delete: async (id) => {
    return apiCall(`/products/${id}`, { method: 'DELETE' });
  },
};

// Sales API
export const salesAPI = {
  getAll: async () => {
    return apiCall('/sales', { method: 'GET' });
  },

  create: async (saleData) => {
    return apiCall('/sales', {
      method: 'POST',
      body: saleData,
    });
  },

  delete: async (id) => {
    return apiCall(`/sales/${id}`, { method: 'DELETE' });
  },
};

// Activity API
export const activityAPI = {
  getAll: async () => {
    return apiCall('/activity', { method: 'GET' });
  },

  create: async (activityData) => {
    return apiCall('/activity', {
      method: 'POST',
      body: activityData,
    });
  },
};

// Real-time polling function (to replace Firebase real-time listeners)
export const startPolling = (callback, interval = 2000) => {
  const poll = async () => {
    try {
      const [products, sales] = await Promise.all([
        productsAPI.getAll(),
        salesAPI.getAll(),
      ]);
      callback({ products, sales });
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, interval);

  return () => clearInterval(intervalId);
};








