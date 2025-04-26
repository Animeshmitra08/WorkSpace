// store/fileStore.js
import { create } from 'zustand';
import {
  saveFile as saveFileToFirebase,
  deleteFile as deleteFileFromFirebase,
  fetchFiles as fetchFilesFromFirebase
} from '../services/firebaseService';

// Helper to determine file type and initial content
const getFileTypeAndContent = (fileExtension) => {
  let type = 'text';
  let initialContent = '';
  
  // Set language and initial content based on extension
  switch(fileExtension) {
    case 'js':
      type = 'javascript';
      initialContent = '// JavaScript file\n\n';
      break;
    case 'html':
      type = 'html';
      initialContent = '<!DOCTYPE html>\n<html>\n<head>\n  <title>Title</title>\n</head>\n<body>\n  \n</body>\n</html>';
      break;
    case 'css':
      type = 'css';
      initialContent = '/* CSS Styles */\n\n';
      break;
    case 'py':
      type = 'python';
      initialContent = '# Python file\n\n';
      break;
    case 'md':
      type = 'markdown';
      initialContent = '# Markdown Document\n\n';
      break;
    default:
      type = 'text';
      initialContent = '';
  }
  
  return { type, initialContent };
};

const useFileStore = create((set, get) => ({
  // State
  files: [],
  selectedFile: null,
  isLoading: false,
  error: null,
  
  // Load files from Firebase
  fetchFiles: async () => {
    try {
      set({ isLoading: true, error: null });
      const files = await fetchFilesFromFirebase();
      set({ files, isLoading: false });
      return files;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error fetching files:', error);
      return [];
    }
  },
  
  // Actions
  setSelectedFile: (file) => {
    set({ selectedFile: file });
  },
  
  updateFileContent: (content) => set((state) => ({
    selectedFile: state.selectedFile ? { ...state.selectedFile, content } : null
  })),
  
  saveFile: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const savedFile = await saveFileToFirebase(file);
      
      set((state) => {
        // Update existing file or add new one
        const existingFileIndex = state.files.findIndex(f => f.id === savedFile.id);
        let updatedFiles;
        
        if (existingFileIndex >= 0) {
          updatedFiles = [...state.files];
          updatedFiles[existingFileIndex] = savedFile;
        } else {
          updatedFiles = [...state.files, savedFile];
        }
        
        return { 
          files: updatedFiles, 
          isLoading: false,
          selectedFile: savedFile
        };
      });
      
      return savedFile;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error saving file:', error);
      throw error;
    }
  },
  
  createFile: async (name, folderPath) => {
    if (!name) {
      set({ error: 'Please enter a file name' });
      return null;
    }

    const fileExtension = name.includes('.') ? 
      name.split('.').pop().toLowerCase() : '';
    
    const { type, initialContent } = getFileTypeAndContent(fileExtension);

    const newFile = {
      name: name,
      type: type,
      content: initialContent,
      folder: folderPath,
      lastModified: new Date().toISOString()
    };

    try {
      const savedFile = await get().saveFile(newFile);
      return savedFile;
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },
  
  deleteFile: async (fileId) => {
    try {
      set({ isLoading: true, error: null });
      await deleteFileFromFirebase(fileId);
      
      set((state) => {
        const updatedFiles = state.files.filter(file => file.id !== fileId);
        const updatedSelectedFile = state.selectedFile && state.selectedFile.id === fileId 
          ? null 
          : state.selectedFile;
        
        return { 
          files: updatedFiles, 
          selectedFile: updatedSelectedFile,
          isLoading: false 
        };
      });
      
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error deleting file:', error);
      return false;
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Selectors  
  getFilteredFiles: (folderPath, searchTerm = '') => {
    const { files } = get();
    
    return files.filter(file => 
      file.folder === folderPath && 
      (searchTerm === '' || 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        file.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  },
  
  getRecentFiles: (limit = 5) => {
    const { files } = get();
    return [...files]
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, limit);
  }
}));

export default useFileStore;