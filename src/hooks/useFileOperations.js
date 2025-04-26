// hooks/useFileOperations.js
import { useState } from 'react';
import useFileStore from '../store/fileStore';
import useUIStore from '../store/uiStore';
import useFolderStore from '../store/folderStore';

export const useFileOperations = () => {
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  
  const { createFile, saveFile, deleteFile, selectedFile, updateFileContent } = useFileStore();
  const { setIsEditing, showNotification } = useUIStore();
  const { createFolder } = useFolderStore();
  
  const handleCreateFile = () => {
    if (createFile(newFileName)) {
      setNewFileName('');
    }
  };
  
  const handleCreateFolder = () => {
    createFolder(newFolderName);
    setShowNewFolderInput(false);
    setNewFolderName('');
  };
  
  const handleSaveFile = () => {
    if (selectedFile) {
      saveFile(selectedFile);
    }
  };
  
  const handleDeleteFile = (fileId, e) => {
    e?.stopPropagation();
    deleteFile(fileId);
  };
  
  const handleContentChange = (value) => {
    updateFileContent(value);
  };
  
  const toggleNewFolderInput = () => {
    setShowNewFolderInput(!showNewFolderInput);
    if (showNewFolderInput) {
      setNewFolderName('');
    }
  };
  
  return {
    newFileName,
    setNewFileName,
    newFolderName,
    setNewFolderName,
    showNewFolderInput,
    handleCreateFile,
    handleCreateFolder,
    handleSaveFile,
    handleDeleteFile,
    handleContentChange,
    toggleNewFolderInput
  };
};

export default useFileOperations;