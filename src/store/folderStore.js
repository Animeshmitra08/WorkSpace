// store/folderStore.js
import { create } from 'zustand';
import useUIStore from './uiStore';

// Initial folders data
const initialFolders = ['/', '/documents'];

const useFolderStore = create((set, get) => ({
  // State
  folders: initialFolders,
  currentFolder: '/',
  
  // Actions
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  
  createFolder: (name) => {
    if (!name) {
      useUIStore.getState().showNotification('Please enter a folder name', 'error');
      return;
    }

    const currentFolder = get().currentFolder;
    const folderPath = currentFolder === '/' ? 
      `/${name}` : 
      `${currentFolder}/${name}`;
    
    set((state) => {
      if (!state.folders.includes(folderPath)) {
        return { folders: [...state.folders, folderPath] };
      }
      return state;
    });
    
    useUIStore.getState().showNotification(`Created folder ${name}`, 'success');
  },
  
  navigateUp: () => {
    const currentFolder = get().currentFolder;
    if (currentFolder === '/') return;
    
    const parts = currentFolder.split('/');
    parts.pop();
    const parentFolder = parts.length === 1 ? '/' : parts.join('/');
    set({ currentFolder: parentFolder });
  },
  
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