// store/authStore.js
import { create } from 'zustand';
import { signIn, signUp, signOut, getCurrentUser, onAuthChange } from '../services/authService';

const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address format';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'Email is already in use by another account';
    case 'auth/weak-password':
      return 'Password is too weak - use at least 6 characters';
    case 'auth/network-request-failed':
      return 'Network error - check your connection';
    default:
      return error.message || 'An unknown error occurred';
  }
};

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
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
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
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
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
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;