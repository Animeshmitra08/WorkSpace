// store/uiStore.js
import { create } from 'zustand';

const useUIStore = create((set) => ({
  // State
  showSidebar: true,
  notification: null, // Change to null instead of an object with show property
  isEditing: false,
  searchTerm: '',
  
  // Actions
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  
  setIsEditing: (isEditing) => set({ isEditing }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } });
  },
  
  clearNotification: () => set({ notification: null })
}));

export default useUIStore;