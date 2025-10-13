import { create } from 'zustand';
import { getStoredUser, setStoredUser, setAuthToken } from '../_helpers/index.js';

/**
 * Store global de autenticación usando Zustand
 * Maneja el estado del usuario y la sesión
 */

/**
 * Hook de Zustand para manejo de autenticación global
 */
export const useAuthStore = create((set) => ({
  // Estado
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),

  // Debug: verificar estado inicial
  debug: () => {
    console.log('AuthStore - user:', getStoredUser());
    console.log('AuthStore - isAuthenticated:', !!getStoredUser());
  },

  // Acciones
  login: (user, token = null) => {
    console.log('AuthStore - login called with:', user);
    setStoredUser(user);
    if (token) {
      setAuthToken(token);
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    console.log('AuthStore - logout called');
    setStoredUser(null);
    setAuthToken(null);
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => {
      const updatedUser = { ...state.user, ...userData };
      setStoredUser(updatedUser);
      return { user: updatedUser };
    });
  },

  // TODO: Agregar más acciones según sea necesario
  // - refreshToken()
  // - checkSession()
}));


