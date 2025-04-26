// store/fileStore.js
import { create } from 'zustand';
import useUIStore from './uiStore';
import useFolderStore from './folderStore';
import { saveFile, deleteFile } from '../services/firebaseService';

// Initial files data
const initialFiles = [
  {
    id: '1',
    name: 'example.js',
    type: 'javascript',
    content: '// This is a JavaScript file\nconsole.log("Hello world!");',
    folder: '/',
    lastModified: new Date().toISOString()
  },
  {
    id: '2',
    name: 'styles.css',
    type: 'css',
    content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
    folder: '/',
    lastModified: new Date().toISOString()
  },
  {
    id: '3',
    name: 'notes.md',
    type: 'markdown',
    content: '# Project Notes\n\n- Add authentication\n- Implement file sharing\n- Create proper documentation',
    folder: '/documents',
    lastModified: new Date().toISOString()
  }
];

const useFileStore = create((set, get) => ({
  // State
  files: initialFiles,
  selectedFile: null,
  
  // Actions
  setSelectedFile: (file) => {
    set({ selectedFile: file });
    useUIStore.getState().setIsEditing(false);
  },
  
  updateFileContent: (content) => set((state) => ({
    selectedFile: state.selectedFile ? { ...state.selectedFile, content } : null
  })),
  
  saveFile: async (file) => {
    const updatedFile = {
      ...file,
      lastModified: new Date().toISOString()
    };
    
    try {
      // In a real app, this would be an API call
      await saveFile(updatedFile);
      
      set((state) => {
        const existingFileIndex = state.files.findIndex(f => f.id === file.id);
        if (existingFileIndex >= 0) {
          const updatedFiles = [...state.files];
          updatedFiles[existingFileIndex] = updatedFile;
          return { files: updatedFiles };
        } else {
          const newFile = { ...updatedFile, id: Date.now().toString() };
          return { files: [...state.files, newFile] };
        }
      });
      
      useUIStore.getState().setIsEditing(false);
      useUIStore.getState().showNotification(`Saved ${file.name}`, 'success');
      return updatedFile;
    } catch (error) {
      useUIStore.getState().showNotification(`Failed to save: ${error.message}`, 'error');
      return file;
    }
  },
  
  createFile: (name) => {
    if (!name) {
      useUIStore.getState().showNotification('Please enter a file name', 'error');
      return null;
    }

    const currentFolder = useFolderStore.getState().currentFolder;
    const fileExtension = name.includes('.') ? 
      name.split('.').pop().toLowerCase() : '';
    
    const { type, initialContent } = get().getFileTypeAndContent(fileExtension);

    const newFile = {
      name: name,
      type: type,
      content: initialContent,
      folder: currentFolder,
      lastModified: new Date().toISOString()
    };

    const savedFile = get().saveFile(newFile);
    set({ selectedFile: savedFile });
    useUIStore.getState().setIsEditing(true);
    useUIStore.getState().showNotification(`Created ${name}`, 'success');
    return savedFile;
  },
  
  deleteFile: async (fileId) => {
    try {
      // In a real app, this would be an API call
      await deleteFile(fileId);
      
      set((state) => {
        const updatedFiles = state.files.filter(file => file.id !== fileId);
        const updatedSelectedFile = state.selectedFile && state.selectedFile.id === fileId 
          ? null 
          : state.selectedFile;
        
        return { 
          files: updatedFiles, 
          selectedFile: updatedSelectedFile
        };
      });
      
      if (get().selectedFile === null) {
        useUIStore.getState().setIsEditing(false);
      }
      
      useUIStore.getState().showNotification('File deleted', 'info');
    } catch (error) {
      useUIStore.getState().showNotification(`Failed to delete: ${error.message}`, 'error');
    }
  },
  
  // Helpers
  getFileTypeAndContent: (fileExtension) => {
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
  },
  
  // Selectors
  getFilteredFiles: () => {
    const { files } = get();
    const { currentFolder } = useFolderStore.getState();
    const { searchTerm } = useUIStore.getState();
    
    return files.filter(file => 
      file.folder === currentFolder && 
      (file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
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