// src/hooks/useFileOperations.js
import { useState } from 'react';
import useFileStore from '../store/fileStore';
import useFolderStore from '../store/folderStore';
import useUIStore from '../store/uiStore';
import { checkFileExists } from '../services/firebaseService';

const useFileOperations = () => {
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  
  const { createFile, deleteFile } = useFileStore();
  const { currentFolder, createFolder } = useFolderStore();
  const { showNotification } = useUIStore();
  
  const handleCreateFile = async () => {
    if (!newFileName) {
      showNotification('Please enter a file name', 'error');
      return;
    }
    
    try {
      // Check if file already exists
      const fileExists = await checkFileExists(newFileName, currentFolder);
      if (fileExists) {
        showNotification('A file with this name already exists', 'error');
        return;
      }
      
      const file = await createFile(newFileName, currentFolder);
      if (file) {
        showNotification(`File "${newFileName}" created successfully`, 'success');
        setNewFileName('');
      }
    } catch (error) {
      showNotification(`Error creating file: ${error.message}`, 'error');
    }
  };
  
  const handleCreateFolder = async () => {
    if (!newFolderName) {
      showNotification('Please enter a folder name', 'error');
      return;
    }
    
    try {
      const folder = await createFolder(newFolderName);
      if (folder) {
        showNotification(`Folder "${newFolderName}" created successfully`, 'success');
        setNewFolderName('');
        setShowNewFolderInput(false);
      }
    } catch (error) {
      showNotification(`Error creating folder: ${error.message}`, 'error');
    }
  };
  
  const handleDeleteFile = async (fileId, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const result = await deleteFile(fileId);
        if (result) {
          showNotification('File deleted successfully', 'success');
        }
      } catch (error) {
        showNotification(`Error deleting file: ${error.message}`, 'error');
      }
    }
  };
  
  const toggleNewFolderInput = () => {
    setShowNewFolderInput(!showNewFolderInput);
  };
  
  return {
    newFileName,
    setNewFileName,
    newFolderName,
    setNewFolderName,
    showNewFolderInput,
    handleCreateFile,
    handleCreateFolder,
    handleDeleteFile,
    toggleNewFolderInput
  };
};

export default useFileOperations;