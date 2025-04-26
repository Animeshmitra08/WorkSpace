// store/authStore.js
import { create } from 'zustand';
import { signIn, signUp, signOut, getCurrentUser, onAuthChange } from '../services/authService';

const useAuthStore = create((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  // Initialize auth state
  initAuth: () => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: null 
        });
      }
    });
    
    // Return unsubscribe function to clean up listener
    return unsubscribe;
  },
  
  // Login
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const user = await signIn(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Register
  register: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const user = await signUp(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Logout
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;