// store/uiStore.js
import { create } from 'zustand';

const useUIStore = create((set) => ({
  // State
  showSidebar: true,
  notification: { show: false, message: '', type: '' },
  isEditing: false,
  searchTerm: '',
  
  // Actions
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  
  setIsEditing: (isEditing) => set({ isEditing }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  showNotification: (message, type = 'info') => {
    set({ notification: { show: true, message, type } });
    setTimeout(() => 
      set({ notification: { show: false, message: '', type: '' } }), 
      3000
    );
  }
}));

export default useUIStore;