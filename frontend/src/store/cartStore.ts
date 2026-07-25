import { create } from 'zustand';
import { Course } from '../types';
import api from '../api/axios';

interface CartState {
  items: Course[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (course: Course) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/cart');
      set({ items: res.data.courses || [] });
    } catch (e) {
      console.error('Error fetching cart', e);
    } finally {
      set({ loading: false });
    }
  },
  addToCart: async (course) => {
    try {
      await api.post('/api/cart/add', { courseId: course.id });
      const currentItems = get().items;
      if (!currentItems.some((item) => item.id === course.id)) {
        set({ items: [...currentItems, course] });
      }
    } catch (e) {
      console.error('Error adding to cart', e);
      throw e;
    }
  },
  removeFromCart: async (courseId) => {
    try {
      await api.delete(`/api/cart/remove/${courseId}`);
      const currentItems = get().items;
      set({ items: currentItems.filter((item) => item.id !== courseId) });
    } catch (e) {
      console.error('Error removing from cart', e);
      throw e;
    }
  },
  clearCart: () => {
    set({ items: [] });
  }
}));
