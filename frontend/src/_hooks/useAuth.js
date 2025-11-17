import { useAuthStore } from '../_store/authStore.js';

/**
 * Hook personalizado para acceder al estado de autenticación
 * Wrapper sobre el store de Zustand
 * @returns {Object} Estado y métodos de autenticación
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
};






