import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => boolean;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token, user) => {
    const sanitizedUser = { ...user, enrolledCourses: user.enrolledCourses || [] };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(sanitizedUser));
    set({ token, user: sanitizedUser, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
  initialize: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const sanitizedUser = { ...user, enrolledCourses: user.enrolledCourses || [] };
        set({ token, user: sanitizedUser, isAuthenticated: true });
        return true;
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return false;
  },
  updateUser: (user) => {
    const sanitizedUser = { ...user, enrolledCourses: user.enrolledCourses || [] };
    localStorage.setItem('user', JSON.stringify(sanitizedUser));
    set({ user: sanitizedUser });
  }
}));
