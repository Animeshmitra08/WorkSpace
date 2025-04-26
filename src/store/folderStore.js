// store/folderStore.js
import { create } from 'zustand';
import { 
  fetchFolders as fetchFoldersFromFirebase,
  createFolder as createFolderInFirebase 
} from '../services/firebaseService';

const useFolderStore = create((set, get) => ({
  // State
  folders: ['/'],
  currentFolder: '/',
  isLoading: false,
  error: null,
  
  // Load folders from Firebase
  fetchFolders: async () => {
    try {
      set({ isLoading: true, error: null });
      const folders = await fetchFoldersFromFirebase();
      set({ folders, isLoading: false });
      return folders;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error fetching folders:', error);
      return [];
    }
  },
  
  // Actions
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  
  createFolder: async (name) => {
    if (!name) {
      set({ error: 'Please enter a folder name' });
      return null;
    }

    try {
      set({ isLoading: true, error: null });
      const currentFolder = get().currentFolder;
      const folderPath = currentFolder === '/' ? 
        `/${name}` : 
        `${currentFolder}/${name}`;
      
      await createFolderInFirebase(folderPath);
      
      set((state) => {
        if (!state.folders.includes(folderPath)) {
          return { 
            folders: [...state.folders, folderPath],
            isLoading: false 
          };
        }
        return { isLoading: false };
      });
      
      return folderPath;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error creating folder:', error);
      return null;
    }
  },
  
  navigateUp: () => {
    const currentFolder = get().currentFolder;
    if (currentFolder === '/') return;
    
    const parts = currentFolder.split('/');
    parts.pop();
    const parentFolder = parts.length === 1 ? '/' : parts.join('/');
    set({ currentFolder: parentFolder });
  },
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Selectors
  getSubFolders: () => {
    const { folders, currentFolder } = get();
    return folders.filter(folder => 
      folder !== currentFolder && 
      (currentFolder === '/' ? 
        folder.startsWith('/') && folder.split('/').length === 2 : 
        folder.startsWith(currentFolder) && folder.split('/').length === currentFolder.split('/').length + 1)
    );
  }
}));

export default useFolderStore;