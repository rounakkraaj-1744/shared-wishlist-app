import { Product } from '../types';
import { apiClient } from './client';

// User services
export const userService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/users/signup', { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
};

// Wishlist services
export const wishlistService = {
  create: async (name: string) => {
    const response = await apiClient.post('/wishlists', { name });
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/wishlists');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/wishlists/${id}`);
    return response.data;
  },

  share: async (wishlistId: number, email: string) => {
    const response = await apiClient.post(`/wishlists/${wishlistId}/share`, { email });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/wishlists/${id}`);
    return response.data;
  },
};

// Product services
export const productService = {
  add: async (wishlistId: number, name: string, imageUrl: string, price: number) => {
    const response = await apiClient.post(`/wishlists/${wishlistId}/products`, {
      name,
      imageUrl,
      price,
    });
    return response.data;
  },

  update: async (wishlistId: number, productId: number, data: Partial<Product>) => {
    const response = await apiClient.put(`/wishlists/${wishlistId}/products/${productId}`, data);
    return response.data;
  },

  delete: async (wishlistId: number, productId: number) => {
    const response = await apiClient.delete(`/wishlists/${wishlistId}/products/${productId}`);
    return response.data;
  },
}; 